import React, {useEffect} from "react";
import {Button, Block, Text, Flexbox, TextField, Checkbox} from "@flow-ui/core";
import {Upload} from "@flow-ui/core/icons";
import {ipcRenderer} from "electron";
import {IStepProps} from "..";

// eslint-disable-next-line max-lines-per-function
const GeneralSetup = (props: IStepProps) => {
    useEffect(() => {
        props.setTitle("General setup");
        props.setSubtitle("Setup general properties");
    }, []);

    return (
        <Block>
            <Block>
                <Text
                    style={{
                        display: "block",
                    }}
                >
                    <h2>Need install dependency:</h2>
                </Text>
                <Text
                    style={{
                        display: "block",
                    }}
                >
                    - Java 8+
                </Text>
                <Text
                    style={{
                        display: "block",
                    }}
                >
                    - Node.js 12+
                </Text>
                <Text
                    style={{
                        display: "block",
                    }}
                >
                    - Nginx
                </Text>
                <Text
                    style={{
                        display: "block",
                    }}
                >
                    - Yarn
                </Text>
                <Text
                    style={{
                        display: "block",
                    }}
                >
                    - PostgreSql 11+
                </Text>
            </Block>
            <Block p="1rem" pt="5rem">
                <Flexbox flex={1}>
                    <TextField
                        flex={1}
                        label="BackEnd location"
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                        value={props.config.appLocation}
                        onChange={(e) => {
                            ipcRenderer.send("check_config_install", JSON.stringify(props.config));
                            props.setConfig({
                                appLocation: e.target.value,
                            });
                        }}
                        hint="Provide path where you would like to install gate"
                        mb="2rem"
                        rightChild={
                            <Upload
                                onClick={() => {
                                    ipcRenderer.send(
                                        "select-dirs",
                                        JSON.stringify({
                                            config: props.config,
                                            key: "appLocation",
                                        }),
                                    );
                                }}
                            ></Upload>
                        }
                    />
                    <TextField
                        flex={1}
                        label="FrontEnd location"
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                        value={props.config.wwwLocation}
                        onChange={(e) => {
                            props.setConfig({
                                wwwLocation: e.target.value,
                            });
                        }}
                        hint="Provide path where you would like to install www"
                        mb="2rem"
                        rightChild={
                            <Upload
                                onClick={() => {
                                    ipcRenderer.send(
                                        "select-dirs",
                                        JSON.stringify({
                                            config: props.config,
                                            key: "wwwLocation",
                                        }),
                                    );
                                }}
                            ></Upload>
                        }
                    />
                </Flexbox>
                <Flexbox>
                    <Flexbox
                        flex={1}
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                    >
                        <Checkbox
                            flex={1}
                            label="Update"
                            checked={props.config.isUpdate}
                            onChange={() => {
                                const isUpdate = !props.config.isUpdate;

                                props.setConfig({
                                    isUpdate,
                                });
                            }}
                            mb="1rem"
                        />
                    </Flexbox>
                    {props.config.isUpdate ? null : (
                        <TextField
                            flex={1}
                            label="App port"
                            style={{
                                margin: "10px 10px 10px 10px",
                            }}
                            value={props.config.appPort}
                            onChange={(e) => {
                                props.setConfig({
                                    appPort: e.target.value,
                                });
                            }}
                            hint="Port app gate"
                            mb="2rem"
                        />
                    )}
                </Flexbox>
            </Block>
            <Flexbox justifyContent="flex-end">
                <Button
                    onClick={() => {
                        ipcRenderer.send("check", JSON.stringify(props.config));
                    }}
                >
                    <Flexbox>Next</Flexbox>
                </Button>
            </Flexbox>
        </Block>
    );
};

export default GeneralSetup;
