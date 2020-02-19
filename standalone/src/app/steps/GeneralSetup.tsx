import React, { useEffect } from "react"
import { StepProps } from ".."
import { Button, Block, Flexbox, TextField, notify, Checkbox } from "@flow-ui/core"
import { ipcRenderer } from "electron"

const GeneralSetup = (props: StepProps) => {
    useEffect(() => {
        props.setTitle("General setup")
        props.setSubtitle("Setup general properties")

        ipcRenderer.on("check", (event, arg) => {
            if (!arg) {
                props.onNext()
                return
            }
            notify({
                title: "Error",
                message: arg,
                timeout: 5000,
            })
        })
    }, [])

    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Flexbox flex={1}>
                    <TextField
                        flex={1}
                        label="BackEnd location"
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                        value={props.config.appLocation}
                        onChange={e => {
                            ipcRenderer.send("check_config_install", JSON.stringify(props.config))
                            props.setConfig({
                                appLocation: e.target.value,
                            })
                        }}
                        hint="Provide path where you would like to install gate"
                        mb="2rem"
                    />
                    <TextField
                        flex={1}
                        label="FrontEnd location"
                        style={{
                            margin: "10px 10px 10px 10px",
                        }}
                        value={props.config.wwwLocation}
                        onChange={e => {
                            props.setConfig({
                                wwwLocation: e.target.value,
                            })
                        }}
                        hint="Provide path where you would like to install www"
                        mb="2rem"
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
                            onChange={e => {
                                const isUpdate = !props.config.isUpdate
                                props.setConfig({
                                    isUpdate,
                                    dbUsername: isUpdate ? "s_su" : "postgres",
                                    dbPassword: isUpdate ? "s_su" : "postgres",
                                })
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
                            onChange={e => {
                                props.setConfig({
                                    appPort: e.target.value,
                                })
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
                        ipcRenderer.send("check", JSON.stringify(props.config))
                    }}
                    children={<Flexbox>Next</Flexbox>}
                />
            </Flexbox>
        </Block>
    )
}
export default GeneralSetup
