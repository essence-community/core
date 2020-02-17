import React, { useEffect } from "react"
import { StepProps } from ".."
import { Button, Block, Flexbox, Text } from "@flow-ui/core"
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
                    <Text>To start server, run command "yarn server" from installation directory</Text>
                </Block>
            </Block>
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
        </Block>
    )
}
export default Finish