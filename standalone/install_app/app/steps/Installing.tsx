import { Block, Button, C1, Flexbox, Icon, Meter, Panel, Divider } from "@flow-ui/core"
import React, { useEffect, useState } from "react"
import { StepProps } from ".."
import { ipcRenderer } from 'electron'

const Installing = (props: StepProps) => {
    const [message, setMessage] = useState('Installing...')
    const [error, setError] = useState('')
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        props.setTitle('Installing')
        props.setSubtitle('Wait until complete, it may take a couple of minutes')

        ipcRenderer.on('progress', (event, arg) => {
            const pkg = JSON.parse(arg)
            setMessage(pkg.message)
            setProgress(pkg.percent)
            if (pkg.percent == 100) {
                props.onNext()
            }
        })

        ipcRenderer.on('install_error', (event, arg) => {
            setError(arg)
        })

        ipcRenderer.send('install', JSON.stringify(props.config))
    },[])

    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Flexbox column >
                    <Block flex={1}>
                        <Meter 
                            shape="square"
                            size="xlarge"
                            color={c => error.length ? c.accent.red.hex() : c.primary.hex()}
                            decoration="outline"
                            animated
                            percent={progress} 
                        />
                    </Block>
                    <C1 color={c => c.light.hex()}>{message}</C1>
                    {error && (
                        <Block>
                            <Divider />
                            <C1 color={c => c.accent.red.hex()}>
                                <Icon
                                    size={"1.5rem"}
                                    pr="0.5rem"
                                    type={t => t.outline.alertTriangle}
                                /> {error}
                            </C1>
                        </Block>
                    )}
                </Flexbox>
            </Block>
            <Panel align="bottom" borderWidth={0} p={"1rem"}>
                    
            </Panel>
        </Block>
    )
}
export default Installing