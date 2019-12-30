import React, { useEffect } from "react"
import { StepProps } from ".."
import { Panel, Button, Block, H1, Flexbox, TextField, Icon, notify } from "@flow-ui/core"
import { ipcRenderer } from 'electron'

const GeneralSetup = (props: StepProps) => {
    useEffect(() => {
        props.setTitle('General setup')
        props.setSubtitle('Setup general properties')

        ipcRenderer.on('check', (event, arg) => {
            if (!arg) {
                props.onNext()
                return
            }
            notify({
                title: 'Error',
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
                        label="Install location"
                        value={props.config.appLocation}
                        onChange={e => {
                            props.setConfig({
                                appLocation: e.target.value
                            })
                        }}
                        hint="Provide path where you would like to install app"
                        mb="2rem"
                    />
                </Flexbox>
                <Flexbox>
                    <TextField
                        flex={1}
                        label="Hostname"
                        value={props.config.serverHost}
                        onChange={e => {
                            props.setConfig({
                                serverHost: e.target.value
                            })
                        }}
                        mb="1rem"
                    />
                    <TextField
                        flex={1}
                        label="Self IP"
                        value={props.config.serverIp}
                        onChange={e => {
                            props.setConfig({
                                serverIp: e.target.value
                            })
                        }}
                        mb="1rem"
                        mr="0.5rem"
                        ml="0.5rem"
                    />
                    <TextField
                        flex={1}
                        label="Listen port"
                        value={props.config.appPort}
                        onChange={e => {
                            props.setConfig({
                                appPort: e.target.value
                            })
                        }}
                        mb="1rem"
                    />
                </Flexbox>
            </Block>
            <Panel align="bottom" borderWidth={0} p={"1rem"}>
                <Flexbox justifyContent="flex-end">
                    <Button
                        onClick={() => {
                            ipcRenderer.send('check', JSON.stringify(props.config))
                        }}
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
export default GeneralSetup