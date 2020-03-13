import { Block, Button, Flexbox, Grid, dialog, notify, Text, TextField, Header, Paragraph } from "@flow-ui/core";
import { AlertTriangle, ArrowIosBack, ArrowIosForward, Globe2, Info } from "@flow-ui/core/icons";
import { ipcRenderer } from "electron";
import React, { Fragment, useEffect } from "react";
import { IStepProps } from "..";

// eslint-disable-next-line max-lines-per-function
const DatabaseSetup = (props: IStepProps) => {
    const { config, setConfig } = props

    useEffect(() => {
        props.setTitle("Database");
        props.setSubtitle("Setup PostgreSQL settings");

        const onConnectionCheck = (event, arg) => {
            if (!arg) {
                notify({
                    message: "Success!",
                    timeout: 3000,
                    title: "Connection",
                });

                return;
            }
            notify({
                message: arg,
                timeout: 5000,
                title: "Connection",
            });
        }
        ipcRenderer.on("check_database_connection", onConnectionCheck);

        return () => {
            ipcRenderer.removeListener("check_database_connection", onConnectionCheck);
        }
    }, []);

    return (
        <Fragment>
            <Flexbox 
                p="m"
                mb="m"
                backgroundColor={c => c.warning.alpha(0.2)}
                textColor={c => c.warning}
                borderRadius=".5rem"
                alignItems="center"
                children={(
                    <Fragment>
                        <AlertTriangle pr={"0.5rem"} />
                        <Text flex={1} weight={500}>Credential should be with admin access. Installaction process will create core users</Text>
                    </Fragment>
                )}
            />
            <Grid columnGap="0.5rem" rowGap="2rem" templateColumns="1fr 1fr" alignItems="start">
                <TextField
                    label="Username"
                    value={config.dbUsername}
                    onChange={(e) =>
                        setConfig({
                            dbUsername: e.target.value,
                        })
                    }
                />
                <TextField
                    label="Password"
                    value={config.dbPassword}
                    onChange={(e) =>
                        setConfig({
                            dbPassword: e.target.value,
                        })
                    }
                />
                <TextField
                    label="Connection string"
                    value={config.dbConnectString}
                    onChange={(e) =>
                        setConfig({
                            dbConnectString: e.target.value,
                        })
                    }
                />
                <div></div>
                <TextField
                    label="Database meta prefix"
                    value={config.dbPrefixMeta}
                    onChange={(e) =>
                        setConfig({
                            dbPrefixMeta: e.target.value,
                        })
                    }
                />
                <TextField
                    label="Database auth prefix"
                    value={config.dbPrefixAuth}
                    onChange={(e) =>
                        setConfig({
                            dbPrefixAuth: e.target.value,
                        })
                    }
                />
            </Grid>
            <Flexbox 
                p="m"
                mt="m"
                backgroundColor={c => c.primary.alpha(0.2)} 
                textColor={c => c.primary}
                borderRadius=".5rem"
                alignItems="center"
                children={(
                    <Fragment>
                        <Info pr={"0.5rem"} />
                        <Text flex={1} weight={500}>Installation will create "{config.dbPrefixMeta}meta" and "{config.dbPrefixAuth}auth" databases</Text>
                    </Fragment>
                )}
            />
            <Block flex={1} />
            <Flexbox
                p="m"
                mx="-1rem"
                backgroundColor={c => c.surface}
                justifyContent="flex-end"
            >
                <Button
                    color={c => c.secondary}
                    children="Check connection"
                    rightChild={<Globe2 />}
                    onClick={() => {
                        ipcRenderer.send("check_database_connection", JSON.stringify(config));
                    }}
                />
                <Block flex={1} />
                <Button
                    children="Back"
                    leftChild={<ArrowIosBack />}
                    mr="s"
                    decoration="text"
                    onClick={props.onPrev}
                />
                <Button
                    children="Continue"
                    rightChild={<ArrowIosForward />}
                    onClick={() => {
                        if (config.isUpdate) {
                            dialog({
                                hideHeader: true,
                                customContent: (close) => (
                                    <Flexbox column alignItems="center">
                                        <AlertTriangle
                                            color={c => c.warning}
                                            size="4rem"
                                        />
                                        <Header
                                            m={0}
                                            color={c => c.warning}
                                            children="Update"
                                        />
                                        <Paragraph
                                            color={c => c.hard}
                                            children="Please make sure you've backup previos installation before continue!"
                                        />
                                        <Flexbox>
                                            <Button
                                                mr="m"
                                                color={c => c.secondary}
                                                children="Continue"
                                                onClick={() => {
                                                    close()
                                                    props.onNext()
                                                }}
                                            />
                                            <Button
                                                children="Cancel"
                                                onClick={close}
                                            />
                                        </Flexbox>
                                    </Flexbox>
                                )
                            })
                        } else {
                            props.onNext();
                        }
                    }}
                />
            </Flexbox>
        </Fragment>
    );
};

export default DatabaseSetup;
