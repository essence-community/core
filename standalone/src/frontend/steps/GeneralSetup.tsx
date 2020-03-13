import {Block, Button, Divider, Flexbox, Grid, Paragraph, Text, TextField, Checkbox} from "@flow-ui/core";
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

    const BrowseButton = (props: {value: "appLocation" | "wwwLocation", disabled?: boolean}) => (
        <Button
            size="xs"
            mr="-0.25rem"
            children="Browse"
            decoration="outline"
            rightChild={<Folder />}
            disabled={props.disabled}
            onClick={() => {
                ipcRenderer.send(
                    "select-dirs",
                    JSON.stringify({
                        config,
                        key: props.value,
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
            <Grid mb="1rem" columnGap="0.5rem" rowGap="2rem" templateColumns="1fr 1fr" alignItems="start">
                <Grid my="m" gap="0.5rem">
                    <Paragraph m={0} color={(c) => c.hard}>Select installation mode</Paragraph>
                    <Flexbox mt="0.5rem">
                        <Button
                            decoration={!isUpdate ? "filled" : "outline"}
                            styles={{
                                container: () => [{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }],
                            }}
                            children="Install"
                            onClick={() => {
                                setConfig({ isUpdate: false });
                            }}
                        />
                        <Button
                            decoration={isUpdate ? "filled" : "outline"}
                            styles={{
                                container: () => [{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }],
                            }}
                            children="Update"
                            onClick={() => {
                                setConfig({ isUpdate: true });
                            }}
                        />
                    </Flexbox>
                </Grid>
                <Grid my="m" gap="0.5rem">
                    <Paragraph m={0} color={(c) => c.hard}>Wound you like to {isUpdate ? 'update' : 'install'}</Paragraph>
                    <Checkbox
                        label="Services"
                        checked={config.isInstallApp}
                        onChange={() => {
                            setConfig({
                                isInstallApp: !config.isInstallApp,
                            });
                        }}
                    />
                    <Checkbox
                        label="Web app"
                        checked={config.isInstallWww}
                        onChange={() => {
                            setConfig({
                                isInstallWww: !config.isInstallWww,
                            });
                        }}
                    />
                </Grid>
            </Grid>
            <Divider mb="1rem" gap={5} />
            <Grid columnGap="0.5rem" rowGap="2rem" templateColumns="1fr 1fr" alignItems="start">
                <TextField
                    label="Services location"
                    value={config.appLocation}
                    disabled={!config.isInstallApp}
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
                    rightChild={<BrowseButton disabled={!config.isInstallApp} value="appLocation" />}
                />
                <TextField
                    label="Web app location"
                    value={config.wwwLocation}
                    disabled={!config.isInstallWww}
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
                    rightChild={<BrowseButton disabled={!config.isInstallWww} value="wwwLocation" />}
                />
                {!isUpdate && (
                    <TextField
                        label="Application port"
                        value={config.appPort}
                        disabled={!config.isInstallApp}
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
