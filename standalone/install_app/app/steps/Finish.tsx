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
                
            </Block>
            <Panel align="bottom" css={{borderLeft: 0, borderRight: 0, borderBottom: 0}}>
                
            </Panel>
        </Block>
    )
}
export default Finish