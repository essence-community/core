import React, { useEffect } from "react"
import { StepProps } from ".."
import { Panel, Button, Block, H1, Flexbox, TextField, Icon, Select, C3, notify, Divider } from "@flow-ui/core"
import { ipcRenderer } from 'electron'

const LocationSetup = (props: StepProps) => {
    useEffect(() => {
        props.setTitle('Database')
        props.setSubtitle('Setup postgres settings')

        ipcRenderer.on('check_database_connection', (event, arg) => {
            if (!arg) {
                notify({
                    title: 'Connection',
                    message: "Success!",
                    timeout: 3000
                })
                return
            }
            notify({
                title: 'Connection',
                message: arg,
                timeout: 5000
            })
        })

    }, [])
    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Flexbox flex={1}>
                    <TextField
                        flex={1}
                        mr="1rem"
                        label="Host"
                        value={props.config.dbHost}
                        onChange={e => props.setConfig({
                            dbHost: e.target.value
                        })}
                        mb="1rem"
                    />
                    <TextField
                        label="Port"
                        type="number"
                        value={props.config.dbPort}
                        onChange={e => props.setConfig({
                            dbPort: e.target.value
                        })}
                        mb="1rem"
                    />
                </Flexbox>
                <Flexbox>
                    <TextField
                        flex={1}
                        mr="1rem"
                        label="Username"
                        value={props.config.dbUsename}
                        onChange={e => props.setConfig({
                            dbUsename: e.target.value
                        })}
                        mb="1rem"
                    />
                    <TextField
                        flex={1}
                        label="Password"
                        value={props.config.dbUsename}
                        onChange={e => props.setConfig({
                            dbUsename: e.target.value
                        })}
                        mb="1rem"
                    />
                </Flexbox>
                <C3 
                    color={c => c.accent.orange.hex()}
                    children={(
                        <Flexbox alignItems="center">
                            <Icon 
                                size={"1.5rem"}
                                pr="0.5rem"
                                type={t => t.outline.alertTriangle} 
                            /> Credential should be with admin access. Installaction process will create core users
                        </Flexbox>
                    )}
                />

                <Divider mt="1rem" mb="1rem" />

                <C3 color={c => c.light.hex()}>Installation will create "core" and "core_auth" databases</C3>
            </Block>
            <Panel align="bottom">
                <Flexbox justifyContent="flex-end">
                    <Button
                        color={c => c.accent.orange.hex()}
                        onClick={() => {
                            ipcRenderer.send('check_database_connection', JSON.stringify(props.config))
                        }}
                        children={(
                            <Flexbox>
                                <Icon size="1rem" pr="0.5rem" type={t => t.outline.swap} />
                                Check connection
                            </Flexbox>
                        )}
                    />
                    <Block flex={1} />
                    <Button
                        decoration="text"
                        mr="1rem"
                        onClick={props.onPrev}
                        children={(
                            <Flexbox>
                                <Icon size="1rem" pr="0.5rem" type={t => t.outline.arrowIosBack} />
                                Back
                            </Flexbox>
                        )}
                    />
                    <Button
                        onClick={props.onNext}
                        children={(
                            <Flexbox>
                                Next
                                <Icon size="1rem" pl="0.5rem" type={t => t.outline.arrowIosForward} />
                            </Flexbox>
                        )}
                    />
                </Flexbox>
            </Panel>
        </Block>
    )
}
export default LocationSetup