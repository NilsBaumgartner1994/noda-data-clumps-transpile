import React, {FunctionComponent} from 'react';
import {useSynchedViewOptions, ViewOptionValues} from "../storage/SynchedStateHelper";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    panel: string
}

export const WebIdeCodeActionBarViews : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const panel = props.panel
    const selectedViewOption = viewOptions[panel];

    const dictLabel = {
        [ViewOptionValues.input]: "Input",
        [ViewOptionValues.output]: "Output",
    }

    function getViewOptionItem(viewOptionValue){
        let active = selectedViewOption === viewOptionValue

        return {
            label: dictLabel[viewOptionValue],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = viewOptionValue
                setViewOptions({...viewOptions})
            }
        }
    }

    const selectedLabel = dictLabel[selectedViewOption]

    const items = [
        {
            label: "",
            icon:'pi pi-fw pi-cog',
            items: [
                getViewOptionItem(ViewOptionValues.input),
                getViewOptionItem(ViewOptionValues.output),
            ]
        }
    ];

    return(
        <WebIdeCodeActionBar startComponent={<div>{selectedLabel}</div>} items={items} />
    )

}
