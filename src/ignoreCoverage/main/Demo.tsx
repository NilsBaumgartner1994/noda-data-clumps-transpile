import React, {FunctionComponent, useEffect, useState} from 'react';
// default style
import {
    useIsDarkModeEnabled,
    useSynchedActiveFileKey,
    useSynchedInputFile,
    useSynchedModalState,
    useSynchedOpenedFiles,
    useSynchedViewOptions,
    ViewOptionValues,
    ViewPanelValues
} from "../storage/SynchedStateHelper";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {SynchedStates} from "../storage/SynchedStates";
import {WebIdeCodeActionBarDataClumps} from "../webIDE/WebIdeActionBarDataClumps";
import {WebIdeModalProgress} from "../webIDE/WebIdeModalProgress";
import {WebIdeFileExplorerDropZoneModal} from "../webIDE/WebIdeFileExplorerDropZoneModal";
import {WebIdeFileExplorerDropZone} from "../webIDE/WebIdeFileExplorerDropZone";
import {WebIdeCodeActionBarViews} from "../webIDE/WebIdeActionBarViews";
import {DataClumpsTypeContext} from "data-clumps-type-context";

import { InputNumber } from 'primereact/inputnumber';
import Editor from '@monaco-editor/react';
import {Button} from "primereact/button";
import {transpileDataClumpsTypeContextToNodes} from "../core/transpileDataClumpsTypeContextToNodes";
import {calcPositionOfNodes, getVrBounds} from "../core/calcPositionOfNodes";
import {transpileToNoda} from "../core/transpileToNoda";
import DownloadHelper from "../helper/DownloadHelper";

export interface DemoProps {

}
export const Demo : FunctionComponent<DemoProps> = (props) => {

    const dark_mode = useIsDarkModeEnabled()
    const [from_file_path, setActiveFileKey] = useSynchedActiveFileKey();
    const [modalOptions, setModalOptions] = useSynchedModalState(SynchedStates.modalOptions);
    const [viewOptions, setViewOptions] = useSynchedViewOptions();

    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [loading, setLoading] = useState(false);



    const [transpileSettings, setTranspileSettings] = useState(getVrBounds());

    const handleInputChangeOfBoundingBox = (axis, field, value) => {
        const updatedSettings = { ...transpileSettings };
        updatedSettings[axis][field] = value;
        setTranspileSettings(updatedSettings);
    };

    let onAbort = async () => {
        //console.log("Demo: onAbort")
    }

    const [inputFileContent, setInputFileContent] = useSynchedInputFile();
    const [outputValue, setOutputValue] = useState(null);

    useEffect(() => {
        document.title = "node-galaxy-vr-transpile"
    }, [])

    function renderActionBar(){
        return(
            <div style={{width: "100%"}}>
                <WebIdeCodeActionBarDataClumps key={"1"} loadDataClumpsDict={loadInputFile} />
            </div>
        )
    }

    async function loadInputFile(fileContent: string){
        console.log("loadInputFile")
        setLoading(true);
        modalOptions.visible = true;
        modalOptions.content = "Loading project...";
        setModalOptions(modalOptions);
        modalOptions.visible = false;
        modalOptions.content = "";
        setModalOptions(modalOptions);
        setLoading(false);
        console.log("fileContent");
        console.log(fileContent);
        setInputFileContent(fileContent);
        await handleTranspile(fileContent)
    }

    function handleEditorChange(value, event) {
        setInputFileContent(value)
    }

    function handleOutputEditorChange(value, event) {
        setOutputValue(value)
    }

    function renderPanel(panel: string){
        let content: any = null;

        let selectedViewOption = viewOptions[panel];
        let editorTheme = dark_mode ? "vs-dark" : undefined;

        if(selectedViewOption === ViewOptionValues.input){

            content = (
                // @ts-ignore
                <Editor theme={editorTheme} height="100%" defaultLanguage="javascript" value={inputFileContent} onChange={handleEditorChange} defaultValue={""+inputFileContent} />
            )
        }



        if(selectedViewOption === ViewOptionValues.output){
            content = (
                // @ts-ignore
                <Editor theme={editorTheme} height="100%" defaultLanguage="javascript" value={outputValue} onChange={handleOutputEditorChange} defaultValue={""+outputValue} />
            )
        }


        if(selectedViewOption === ViewOptionValues.settings){
            content = (
                null
            )
        }

        return(
            <>
                <div style={{backgroundColor: 'transparent'}}>
                    <WebIdeCodeActionBarViews panel={panel} />
                </div>
                <div style={{backgroundColor: 'transparent', flex: '1'}}>
                    {content}
                </div>
            </>
        )
    }

    async function handleTranspile(inputFileContent){
        let content = inputFileContent+""
        let testClumps = JSON.parse(content)
        let transpiledAsNodesList = transpileDataClumpsTypeContextToNodes(testClumps);
        let nodesWithPositionCalculated = await calcPositionOfNodes(transpiledAsNodesList)
        let asNodaJson = await transpileToNoda(nodesWithPositionCalculated)
        let asString = JSON.stringify(asNodaJson, null, 4);
        // @ts-ignore
        setOutputValue(asString)
    }

    function renderTranspileButton(){
        return(
            <div style={{width: "100%"}}>
                <Button onClick={async () => {
                    handleTranspile(inputFileContent)
                }}><div>{"Transpile"}</div></Button>
            </div>
        )
    }

    function renderDownloadButton(){
        return(
            <div style={{width: "100%"}}>
                <div>{"Save the downloaded file under: /Android/data/com.codingleap.noda/file/Maps/Transpiled.json"}</div>
                <div>{"Attention: Files > 1mb might load long in Noda"}</div>
                <Button onClick={async () => {
                    DownloadHelper.downloadTextAsFiletile(outputValue, "Transpiled.json")
                }}><div>{"Download"}</div></Button>
            </div>
        )
    }

    function renderBoundingBoxSettings(){
        return (
            <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
                {['x', 'y', 'z'].map(axis => (
                    <div key={axis}>
                        <h3>{axis.toUpperCase()}</h3>
                        {['min', 'max'].map(field => (
                            <div key={field} style={{ marginBottom: '10px' }}>
                                <label>{field} {axis.toUpperCase()}:</label>
                                <InputNumber
                                    value={transpileSettings[axis][field]}
                                    onValueChange={(e) => {
                                        handleInputChangeOfBoundingBox(axis, field, e.value)
                                        setOutputValue(null)
                                    }}
                                    mode="decimal"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    function renderTopContent(){
        return(
            <div style={{width: "100%", display: "flex", flexDirection: "column"}}>
                <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
                    {renderBoundingBoxSettings()}
                </div>
                <div style={{width: "100%",height: 5, backgroundColor: "transparent"}}></div>                <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
                    {renderTranspileButton()}
                    {renderDownloadButton()}
                </div>
                <div style={{width: "100%",height: 15, backgroundColor: "transparent"}}></div>
            </div>
        )
    }

    const actionBar = renderActionBar();

    return (
        <div className={"p-splitter"} style={{width: "100%", height: "100vh", display: "flex", flexDirection: "row"}}>
            <WebIdeFileExplorerDropZone loadInputFile={loadInputFile}>

                <WebIdeLayout
                    menuBarItems={actionBar}
                    panelInitialSizes={[60, 40]}
                    renderAbouveSplitter={() => { return renderTopContent()}}
                >
                    <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                        {renderPanel(ViewPanelValues.leftPanel)}
                    </div>
                    <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                        {renderPanel(ViewPanelValues.rightPanel)}
                    </div>
                </WebIdeLayout>
            </WebIdeFileExplorerDropZone>
            <WebIdeModalProgress onAbort={onAbort} />
            <WebIdeFileExplorerDropZoneModal loadInputFile={loadInputFile} />
        </div>
    );
}
