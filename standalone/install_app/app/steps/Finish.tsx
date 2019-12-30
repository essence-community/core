import React, { useEffect } from "react"
import { StepProps } from ".."
import { Panel, Button, Block, H1, Flexbox, TextField, Icon, Select, C3, notify, Divider } from "@flow-ui/core"
import { ipcRenderer } from 'electron'

const Finish = (props: StepProps) => {
    useEffect(() => {
        props.setTitle('Complete')
        props.setSubtitle('Installation complete successfully')
    }, [])
    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <C3 color={c => c.accent.orange.hex()}>To start server, please goto installation dir </C3>
                <C3 color={c => c.accent.orange.hex()}>& run command "yarn && yarn server"</C3>
            </Block>
        </Block>
    )
}
export default Finish