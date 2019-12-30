import React, { useEffect } from "react"
import { StepProps } from ".."
import { Panel, Button, Block, H1, Flexbox, TextField, Icon, Select, C3, notify, Divider, dialog } from "@flow-ui/core"
import { ipcRenderer } from 'electron'

const Finish = (props: StepProps) => {
    useEffect(() => {
        props.setTitle('Complete')
        props.setSubtitle('Installation complete successfully')
    }, [])
    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Block>
                    <C3 color={c => c.accent.orange.hex()}>To start server, run command "yarn server" from installation directory</C3>
                </Block>
            </Block>
            <Panel align="bottom" borderWidth={0} p={"1rem"}>
                <Flexbox justifyContent="flex-end">
                    <Flexbox flex={1}>
                        <Button
                            decoration="outline"
                            onClick={() => {
                                ipcRenderer.send('open_installation_dir')
                            }}
                            children="Show installation directory"
                        />
                    </Flexbox>
                    <Button
                        onClick={() => {
                            ipcRenderer.send('close')
                        }}
                        children="Close"
                    />
                </Flexbox>
            </Panel>
        </Block>
    )
}
export default Finish