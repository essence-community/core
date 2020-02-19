import React, { useEffect } from "react"
import { StepProps } from ".."
import { Button, Block, Text, Flexbox, TextField, notify, Divider } from "@flow-ui/core"
import { ipcRenderer } from "electron"

const LocationSetup = (props: StepProps) => {
    useEffect(() => {
        props.setTitle("Database")
        props.setSubtitle("Setup PostgreSQL settings")

        ipcRenderer.on("check_database_connection", (event, arg) => {
            if (!arg) {
                notify({
                    title: "Connection",
                    message: "Success!",
                    timeout: 3000,
                })
                return
            }
            notify({
                title: "Connection",
                message: arg,
                timeout: 5000,
            })
        })
    }, [])
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
                        onChange={e =>
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
                        onChange={e =>
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
                    onChange={e =>
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
                    onChange={e =>
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
                    onChange={e =>
                        props.setConfig({
                            dbPrefixAuth: e.target.value,
                        })
                    }
                    mb="1rem"
                />
                <Text
                    children={
                        <Flexbox alignItems="center">
                            Credential should be with admin access. Installaction process will create core users
                        </Flexbox>
                    }
                />

                <Divider mt="1rem" mb="1rem" />

                <Text color={c => c.light.hex()}>
                    Installation will create "{props.config.dbPrefixMeta}meta" and "{props.config.dbPrefixAuth}auth"
                    databases
                </Text>
            </Block>
            <Flexbox justifyContent="flex-end">
                <Button
                    onClick={() => {
                        ipcRenderer.send("check_database_connection", JSON.stringify(props.config))
                    }}
                    children={<Flexbox>Check connection</Flexbox>}
                />
                <Block flex={1} />
                <Button decoration="text" mr="1rem" onClick={props.onPrev} children={<Flexbox>Back</Flexbox>} />
                <Button onClick={props.onNext} children={<Flexbox>Next</Flexbox>} />
            </Flexbox>
        </Block>
    )
}
export default LocationSetup
