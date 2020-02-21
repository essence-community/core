import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {Viewport, notify, Block, Text} from "@flow-ui/core";
import dark from "@flow-ui/core/misc/themes/dark";
import {ipcRenderer} from "electron";

import {IInstallConfig} from "../backend/Config.types";
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
    appLocation: "./gate_work",
    appPort: "8080",
    dbUsername: "postgres",
    dbPassword: "postgres",
    dbConnectString: "postgres://localhost:5432/postgres",
    dbPrefixMeta: "core_",
    dbPrefixAuth: "core_",
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
            <div
                style={{
                    margin: "10px 10px 10px 10px",
                }}
            >
                <Block>
                    <h1>{title}</h1>
                    <Text>{subtitle}</Text>
                </Block>
                <Text color={(c) => c.light.hex()}>
                    Step: {step}/{steps.length}
                </Text>
            </div>
            <div>
                <Block
                    flex={1}
                    mt="3rem"
                    style={{
                        margin: "10px 10px 10px 10px",
                    }}
                >
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
                </Block>
            </div>
        </Viewport>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
