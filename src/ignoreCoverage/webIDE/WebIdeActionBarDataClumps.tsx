import React, {FunctionComponent, useEffect} from 'react';
import {
    ColorModeOptions,
    useDemoType,
    useSynchedColorModeOption,
    useSynchedModalState,
    useSynchedViewOptions,
    ViewOptionValues
} from "../storage/SynchedStateHelper";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";
import {SynchedStates} from "../storage/SynchedStates";
import {ExampleData} from "../core/exampleData/ExampleData";
import {DataClumpsTypeContext} from "data-clumps-type-context";
import {test} from "../core/development";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    loadDataClumpsDict: (project: DataClumpsTypeContext | any) => Promise<void>;
}

export const WebIdeCodeActionBarDataClumps : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const demoType = useDemoType();

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const [colorModeOption, setColorModeOption] = useSynchedColorModeOption();

    const [dropZoneModalOptions, setDropZoneModalOptions] = useSynchedModalState(SynchedStates.dropzoneModal);

    useEffect(() => {
        if(demoType==="main"){
            loadDemoProject();
        }

    }, [])

    async function loadDemoProject(){
        //let demoDataClumpsDict = ExampleData.getArgoUML();
        let demoDataClumpsDict = ExampleData.getTestData();
        props.loadDataClumpsDict(demoDataClumpsDict)
    }

    function renderColorModeItem(){
        let items: any[] = [];
        let colorModeOptionKeys = Object.keys(ColorModeOptions);
        for(let colorModeOptionKey of colorModeOptionKeys){
            let label = ""+ColorModeOptions[colorModeOptionKey]
            let active = colorModeOptionKey === colorModeOption;
            items.push({
                label: label,
                disabled: active,
                icon: active ? "pi pi-check": "",
                command: () => {
                    setColorModeOption(label);
                }
            })
        }

        return {
            label: "ColorMode: "+colorModeOption,
            icon: "pi pi-sun",
            items: items
        }
    }

    const items = [
        {
            label:'File',
            icon:'pi pi-fw pi-file',
            items:[
                {
                    label:'Open',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        dropZoneModalOptions.visible = true;
                        setDropZoneModalOptions({...dropZoneModalOptions});
                    }
                }
            ]
        },
        /**
        {
            label:'Test',
            icon:'pi pi-fw pi-cog',
            command: () => {
                test()
            }
        },
            */
        {
            label:'All right reserved 2023 (C)',
            icon: <div style={{marginRight: "8px"}}>{"§"}</div>,
            items:[
                {
                    label:'GitHub project',
                    icon:'pi pi-fw pi-github',
                    url: "https://github.com/baumgartner-software/node-galaxy-vr-transpile"
                },
                {
                    label:'Homepage',
                    icon:'pi pi-fw pi-external-link',
                    url: "https://baumgartner-software.de"
                },
            ]
        }
    ];

    let remoteLogoUrl = "https://raw.githubusercontent.com/baumgartner-software/node-galaxy-vr/main/icon.jpeg"
    let logoUrl = remoteLogoUrl;

    let startItem = (
        <div>
            <a href={"https://github.com/NilsBaumgartner1994/node-galaxy-vr-transpile"}>
                <img src={logoUrl} style={{height: "40px", marginRight: "8px"}} />
            </a>
        </div>
    )

    return(
        <WebIdeCodeActionBar startComponent={startItem} items={items} />
    )

}
