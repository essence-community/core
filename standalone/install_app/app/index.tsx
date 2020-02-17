import React, { useState } from "react"
import ReactDOM from "react-dom"
import { Viewport, Flexbox, Block, Text } from "@flow-ui/core"
import { useTheme } from "@flow-ui/whale"
import dark from "@flow-ui/core/misc/themes/dark"
import GeneralSetup from './steps/GeneralSetup'
import DatabaseSetup from './steps/DatabaseSetup'
import Installing from './steps/Installing'
import Finish from './steps/Finish'

const steps = [
    GeneralSetup,
    DatabaseSetup,
    Installing,
    Finish
]
export interface StepProps {
    setTitle: (value: string) => void
    setSubtitle: (value: string) => void
    onNext: () => void
    onPrev: () => void

    config: InstallConfig,
    setConfig: (cfg: InstallConfig) => void 
}

export interface InstallConfig {
    serverHost?: string
    serverIp?: string
    appLocation?: string
    appPort?: string
    dbHost?: string
    dbPort?: string
    dbUsename?: string
    dbPassword?: string
    dbPrefix?: string
}

const defaultConfig: InstallConfig = {
    serverHost: 'core.localhost',
    serverIp: '127.0.0.1',
    appLocation: "./core",
    appPort: "8080",
    dbHost: "localhost",
    dbPort: "5432",
    dbUsename: "postgres",
    dbPassword: "postgres",
    dbPrefix: "core_",
}

const App = () => {
    const [config, setConfig] = useState<InstallConfig>(defaultConfig)
    const [step, setStep] = useState(1)
    const [title, setTitle] = useState("Installation")
    const [subtitle, setSubtitle] = useState("")
    const Step = steps[step - 1]

    return (
        <Viewport theme={dark}>
                <Flexbox justifyContent="space-between" alignItems="center">
                    <Block>
                        <h1>{title}</h1>
                        <Text>{subtitle}</Text>
                    </Block>
                    <Text color={c => c.light.hex()}>Step: {step}/{steps.length}</Text>
                </Flexbox>
            <Block mt="3rem">
                <Step 
                    onNext={() => {
                        setStep(step + 1)
                    }} 
                    onPrev={() => {
                        setStep(step - 1)
                    }} 
                    setTitle={setTitle}
                    setSubtitle={setSubtitle}
                    config={config}
                    setConfig={cfg => setConfig({
                        ...config,
                        ...cfg
                    })}
                />
            </Block>
        </Viewport>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))