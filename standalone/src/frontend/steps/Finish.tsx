import React, {useEffect, useState} from "react";
import {Button, Block, Flexbox, Text} from "@flow-ui/core";
import {ipcRenderer} from "electron";
import {IStepProps} from "..";

const info = (realWwwPath: string, appLocation: string, ungateLocation: string, appPort: string) => {
    return `1. start:
    cd ${ungateLocation} && yarn server 

2. Add to nginx: 
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }
    server {
        listen 80;
        server_name _;
        root ${realWwwPath};
        location /gate-core {
            proxy_pass http://127.0.0.1:${appPort}/api;
        }
        location /core-module {
            alias ${appLocation}/core-module;
        }
        location /core-assets {
            alias ${appLocation}/core-assets;
        }
        location /core_notification {
            proxy_pass http://127.0.0.1:${appPort}/notification;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location / {
            gzip_static on;
            try_files $uri @index;
        }
        location @index {
            add_header Cache-Control no-cache;
            expires 0;
            try_files /index.html =404;
        }
    }

    `;
};
const Finish = (props: IStepProps) => {
    const [realWwwPath, setRealWwwPath] = useState(props.config.wwwLocation!);
    const [realUngatePath, setRealUngatePath] = useState(props.config.appLocation!);
    const [realAppPath, setRealAppPath] = useState(props.config.appLocation!);

    useEffect(() => {
        props.setTitle("Complete");
        props.setSubtitle("Installation complete successfully");
        ipcRenderer.on("real_path", (event, arg) => {
            const obj = JSON.parse(arg);

            setRealWwwPath(obj.wwwLocation);
            setRealAppPath(obj.appLocation);
            setRealUngatePath(obj.ungateLocation);
        });
        ipcRenderer.send("real_path", JSON.stringify(props.config));
    }, []);

    return (
        <Block>
            <Block p="1rem" pt="5rem">
                <Block>
                    <Text>
                        <pre>{info(realWwwPath, realAppPath, realUngatePath, props.config.appPort!)}</pre>
                    </Text>
                </Block>
            </Block>
            <Flexbox justifyContent="flex-end">
                <Button
                    onClick={() => {
                        ipcRenderer.send("close");
                    }}
                >
                    Close
                </Button>
            </Flexbox>
        </Block>
    );
};

export default Finish;
