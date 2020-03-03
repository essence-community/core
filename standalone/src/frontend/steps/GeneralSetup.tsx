import {Block, Button, Flexbox, Grid, Paragraph, Text, TextField, Checkbox} from "@flow-ui/core";
import {ArrowIosForward, Folder} from "@flow-ui/core/icons";
import {ipcRenderer} from "electron";
import React, {Fragment, useEffect} from "react";
import {IStepProps} from "..";

const dependencies = ["Yarn", "Java 8+", "Node.js 12+", "Nginx", "PostgreSql 11+"];

// eslint-disable-next-line max-lines-per-function
const GeneralSetup = (props: IStepProps) => {
    useEffect(() => {
        props.setTitle("General setup");
        props.setSubtitle("Setup general properties");
    }, []);

    const {config, setConfig} = props;
    const {isUpdate} = config;

    const BrowseButton = (props: {value: "appLocation" | "wwwLocation"}) => (
        <Button
            size="xs"
            mr="-0.25rem"
            children="Browse"
            decoration="outline"
            rightChild={<Folder />}
            onClick={() => {
                ipcRenderer.send(
                    "select-dirs",
                    JSON.stringify({
                        config,
                        key: "wwwLocation",
                    }),
                );
            }}
        />
    );

    return (
        <Fragment>
            <Block backgroundColor={(c) => c.warning.alpha(0.2)} borderRadius=".5rem" p="m">
                <Paragraph mb="s" weight={500}>
                    Need install dependency
                </Paragraph>
                {dependencies.map((dependency) => (
                    <Text
                        size="s"
                        m="xs"
                        p="xs"
                        borderRadius=".25rem"
                        backgroundColor={(c) => c.warning.alpha(0.2)}
                        textColor={(c) => c.warning}
                        children={dependency}
                    />
                ))}
            </Block>
            <Block my="m">
                <Paragraph m={0} color={(c) => c.hard}>
                    Installation mode
                </Paragraph>
                <Flexbox>
                    <Button
                        size="xs"
                        decoration={!isUpdate ? "filled" : "outline"}
                        styles={{
                            container: () => [{borderTopRightRadius: 0, borderBottomRightRadius: 0}],
                        }}
                        children="Install"
                        onClick={() => {
                            setConfig({isUpdate: false});
                        }}
                    />
                    <Button
                        size="xs"
                        decoration={isUpdate ? "filled" : "outline"}
                        styles={{
                            container: () => [{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}],
                        }}
                        children="Update"
                        onClick={() => {
                            setConfig({isUpdate: true});
                        }}
                    />
                </Flexbox>
            </Block>
            <Grid columnGap="0.5rem" rowGap="2rem" templateColumns="1fr 1fr" alignItems="start">
                <Checkbox
                    label="Services location"
                    checked={config.isInstallApp}
                    onChange={() => {
                        setConfig({
                            isInstallApp: !config.isInstallApp,
                        });
                    }}
                />
                <Checkbox
                    label="Web app location"
                    checked={config.isInstallWww}
                    onChange={() => {
                        setConfig({
                            isInstallWww: !config.isInstallWww,
                        });
                    }}
                />
            </Grid>
            <Grid columnGap="0.5rem" rowGap="2rem" templateColumns="1fr 1fr" alignItems="start">
                {config.isInstallApp ? (
                    <TextField
                        label="Services location"
                        value={config.appLocation}
                        onChange={(e) => {
                            ipcRenderer.send("check_config_install", JSON.stringify(config));
                            setConfig({
                                appLocation: e.target.value,
                            });
                        }}
                        hint={
                            <Text size="s" color={(c) => c.lightest}>
                                Provide path where you would like to install services
                            </Text>
                        }
                        rightChild={<BrowseButton value="appLocation" />}
                    />
                ) : (
                    <div></div>
                )}
                {config.isInstallWww ? (
                    <TextField
                        label="Web app location"
                        value={config.wwwLocation}
                        onChange={(e) => {
                            setConfig({
                                wwwLocation: e.target.value,
                            });
                        }}
                        hint={
                            <Text size="s" color={(c) => c.lightest}>
                                Provide path where you would like to install www
                            </Text>
                        }
                        rightChild={<BrowseButton value="wwwLocation" />}
                    />
                ) : null}
                {isUpdate || !config.isInstallApp ? null : (
                    <TextField
                        label="Application port"
                        value={config.appPort}
                        onChange={(e) => {
                            setConfig({
                                appPort: e.target.value,
                            });
                        }}
                        hint={
                            <Text size="s" color={(c) => c.lightest}>
                                This port will be listening by gate
                            </Text>
                        }
                    />
                )}
            </Grid>
            <Block flex={1} />
            <Flexbox
                p="m"
                mx="-1rem"
                backgroundColor={(c) => c.surface}
                justifyContent="flex-end"
                children={
                    <Button
                        children="Continue"
                        rightChild={<ArrowIosForward />}
                        onClick={() => {
                            ipcRenderer.send("check", JSON.stringify(config));
                        }}
                    />
                }
            />
        </Fragment>
    );
};

export default GeneralSetup;
