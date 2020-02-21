import {Block, Button, Text, Flexbox, Meter, Divider} from "@flow-ui/core";
import React, {useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import {IStepProps} from "..";

const Installing = (props: IStepProps) => {
    const [message, setMessage] = useState("Installing...");
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        props.setTitle("Installing");
        props.setSubtitle("Wait until complete, it may take a couple of minutes");

        ipcRenderer.on("progress", (event, arg) => {
            const pkg = JSON.parse(arg);

            setMessage(pkg.message);
            setProgress(pkg.percent);
            if (pkg.percent == 100) {
                props.onNext();
            }
        });

        ipcRenderer.on("install_error", (event, arg) => {
            setError(arg);
        });

        ipcRenderer.send("install", JSON.stringify(props.config));
    }, []);

    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Flexbox column>
                    <Block flex={1}>
                        <Meter shape="square" size="xl" decoration="outline" animated percent={progress} />
                    </Block>
                    <Text color={(c) => c.light.hex()}>{message}</Text>
                    {error && (
                        <Block>
                            <Divider />
                            <Text>{error}</Text>
                        </Block>
                    )}
                </Flexbox>
            </Block>
            <Flexbox justifyContent="flex-end">
                {error !== "" && (
                    <Flexbox flex={1}>
                        <Button
                            decoration="outline"
                            onClick={() => {
                                setError("");
                                setMessage("Retrying...");
                                setProgress(0);
                                ipcRenderer.send("install", JSON.stringify(props.config));
                            }}
                        >
                            Retry installation
                        </Button>
                    </Flexbox>
                )}
                <Button
                    disabled={error === ""}
                    onClick={() => {
                        ipcRenderer.send("close");
                    }}
                >
                    Close
                </Button>
            </Flexbox>
        </Block>
    );
};

export default Installing;
