import React, {useEffect, useState} from "react";
import {Button, Block, Text, Flexbox, TextField, notify, Divider, Modal} from "@flow-ui/core";
import {ipcRenderer} from "electron";
import {IStepProps} from "..";

// eslint-disable-next-line max-lines-per-function
const DatabaseSetup = (props: IStepProps) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        props.setTitle("Database");
        props.setSubtitle("Setup PostgreSQL settings");

        ipcRenderer.on("check_database_connection", (event, arg) => {
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
        });
    }, []);

    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Flexbox>
                    <TextField
                        flex={1}
                        mr="1rem"
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                        label="Username"
                        value={props.config.dbUsername}
                        onChange={(e) =>
                            props.setConfig({
                                dbUsername: e.target.value,
                            })
                        }
                        mb="1rem"
                    />
                    <TextField
                        flex={1}
                        label="Password"
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                        value={props.config.dbPassword}
                        onChange={(e) =>
                            props.setConfig({
                                dbPassword: e.target.value,
                            })
                        }
                        mb="1rem"
                    />
                </Flexbox>
                <TextField
                    flex={1}
                    label="Connection string"
                    value={props.config.dbConnectString}
                    style={{
                        margin: "10px 10px 10px 10px",
                    }}
                    onChange={(e) =>
                        props.setConfig({
                            dbConnectString: e.target.value,
                        })
                    }
                    mb="1rem"
                />
                <TextField
                    flex={1}
                    label="Database meta prefix"
                    value={props.config.dbPrefixMeta}
                    style={{
                        margin: "10px 10px 10px 10px",
                    }}
                    onChange={(e) =>
                        props.setConfig({
                            dbPrefixMeta: e.target.value,
                        })
                    }
                    mb="1rem"
                />
                <TextField
                    flex={1}
                    label="Database auth prefix"
                    value={props.config.dbPrefixAuth}
                    style={{
                        margin: "10px 10px 10px 10px",
                    }}
                    onChange={(e) =>
                        props.setConfig({
                            dbPrefixAuth: e.target.value,
                        })
                    }
                    mb="1rem"
                />
                <Text>
                    <Flexbox alignItems="center">
                        Credential should be with admin access. Installaction process will create core users
                    </Flexbox>
                </Text>

                <Divider mt="1rem" mb="1rem" />

                <Text color={(c) => c.light.hex()}>
                    Installation will create "{props.config.dbPrefixMeta}meta" and "{props.config.dbPrefixAuth}auth"
                    databases
                </Text>
            </Block>
            <Flexbox justifyContent="flex-end">
                <Button
                    onClick={() => {
                        ipcRenderer.send("check_database_connection", JSON.stringify(props.config));
                    }}
                >
                    <Flexbox>Check connection</Flexbox>
                </Button>
                <Block flex={1} />
                <Button decoration="text" mr="1rem" onClick={props.onPrev}>
                    <Flexbox>Back</Flexbox>
                </Button>
                <Button
                    onClick={() => {
                        if (props.config.isUpdate) {
                            setOpen(true);
                        } else {
                            props.onNext();
                        }
                    }}
                >
                    <Flexbox>Next</Flexbox>
                </Button>
            </Flexbox>
            <Modal title="Caution!" subtitle="Need backup old install" opened={open}>
                <Flexbox>
                    <Button
                        onClick={() => {
                            props.onNext();
                            setOpen(false);
                        }}
                    >
                        <Flexbox>Ok</Flexbox>
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                        decoration="text"
                        mr="1rem"
                    >
                        <Flexbox>Cancel</Flexbox>
                    </Button>
                </Flexbox>
            </Modal>
        </Block>
    );
};

export default DatabaseSetup;
