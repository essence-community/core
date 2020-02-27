import { Block, Button, Flexbox, Meter, Text } from "@flow-ui/core";
import { Refresh } from "@flow-ui/core/icons";
import { ipcRenderer } from "electron";
import React, { Fragment, useEffect, useState } from "react";
import { IStepProps } from "..";

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
        <Fragment>

            <Block flex={1}>
                <Flexbox justifyContent="space-between" mb="s">
                    <Text weight={500} color={c => error ? c.error : c.onSurface}>{message}</Text>
                    <Text weight={500} color={c => error ? c.error : c.primary}>{progress}%</Text>
                </Flexbox>
                <Meter 
                    loading={error ? false : true}
                    color={c => error ? c.error : c.primary}
                    decoration="outline" 
                    size="xl" 
                    value={progress}
                />
                {error && (
                    <Block mt="m" p="s m" borderRadius="0.5rem" backgroundColor={c => c.error.alpha(0.2)}>
                        <Text size="s">{error}</Text>
                    </Block>
                )}
            </Block>
            <Block flex={1} />
            <Flexbox
                p="m"
                mx="-1rem"
                backgroundColor={c => c.surface}
                justifyContent="flex-end"
                children={(
                    <Fragment>
                        {error !== "" && (
                            <Button
                                children="Retry installation"
                                rightChild={<Refresh />}
                                mr="0.5rem"
                                color={c => c.secondary}
                                onClick={() => {
                                    setError("");
                                    setMessage("Retrying...");
                                    setProgress(0);
                                    ipcRenderer.send("install", JSON.stringify(props.config));
                                }}
                            />
                        )}
                        <Block flex={1} />
                        <Button
                            children="Close"
                            decoration="outline"
                            disabled={error === ""}
                            onClick={() => {
                                ipcRenderer.send("close");
                            }}
                        />
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default Installing;
