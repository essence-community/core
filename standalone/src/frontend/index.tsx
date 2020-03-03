import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Viewport, Header, Paragraph, notify, Flexbox, Block, Text } from "@flow-ui/core";
import dark from "@flow-ui/core/misc/themes/dark";
import { ipcRenderer } from "electron";

import { IInstallConfig } from "../backend/Config.types";
import GeneralSetup from "./steps/GeneralSetup";
import DatabaseSetup from "./steps/DatabaseSetup";
import Installing from "./steps/Installing";
import Finish from "./steps/Finish";

const steps = [GeneralSetup, DatabaseSetup, Installing, Finish];

export interface IStepProps {
    setTitle: (value: string) => void;
    setSubtitle: (value: string) => void;
    onNext: () => void;
    onPrev: () => void;

    config: IInstallConfig;
    setConfig: (cfg: IInstallConfig) => void;
}

/* eslint-disable sort-keys */
const defaultConfig: IInstallConfig = {
    isInstallApp: true,
    appLocation: "./gate_work",
    appPort: "8080",
    dbUsername: "postgres",
    dbPassword: "postgres",
    dbConnectString: "postgres://localhost:5432/postgres",
    dbPrefixMeta: "core_",
    dbPrefixAuth: "core_",
    isInstallWww: true,
    wwwLocation: "./www_public",
};
/* eslint-enable sort-keys */

const App = () => {
    const [config, setConfig] = useState<IInstallConfig>(defaultConfig);
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("Installation");
    const [subtitle, setSubtitle] = useState("");
    const Step = steps[step - 1];
    const onNext = () =>
        ipcRenderer.send(
            "check",
            JSON.stringify({
                config: config,
                step,
            }),
        );

    useEffect(() => {
        ipcRenderer.send("check_config_install");
        ipcRenderer.on("check_config_install", (event, arg) => {
            if (arg) {
                setConfig({
                    ...config,
                    ...JSON.parse(arg),
                });
            }
        });
        ipcRenderer.on("check", (event, arg) => {
            if (!arg) {
                setStep((prevState) => prevState + 1);

                return;
            }
            notify({
                message: arg,
                timeout: 5000,
                title: "Error",
            });
        });
    }, []);

    return (
        <Viewport theme={dark}>
            <Flexbox h="4rem" m="m" justifyContent="space-between" alignItems="center">
                <Block>
                    <Header m={0}>{title}</Header>
                    <Paragraph m={0} color={c => c.lightest}>{subtitle}</Paragraph>
                </Block>
                <Block textColor={(c) => c.light}>
                    Step: {step}/{steps.length}
                </Block>
            </Flexbox>
            <Flexbox column px="1rem" h="calc(100vh - 6rem)" css={{ overflow: 'hidden' }}>
                <Step
                    onNext={onNext}
                    onPrev={() => {
                        setStep(step - 1);
                    }}
                    setTitle={setTitle}
                    setSubtitle={setSubtitle}
                    config={config}
                    setConfig={(cfg) =>
                        setConfig({
                            ...config,
                            ...cfg,
                        })
                    }
                />
            </Flexbox>
        </Viewport>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
