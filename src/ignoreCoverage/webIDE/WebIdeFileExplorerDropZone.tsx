import React, {FunctionComponent, ReactNode} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {DataClumpsTypeContext} from "data-clumps-type-context";

// @ts-ignore
export interface WebIdeFileExplorerDropZoneProps {
    children?: ReactNode;
    onDropComplete?: () => void;
    loadInputFile: (project: string) => Promise<void>;
}

export const WebIdeFileExplorerDropZone : FunctionComponent<WebIdeFileExplorerDropZoneProps> = (props: WebIdeFileExplorerDropZoneProps) => {

    function getFileFromEntry(entry): Promise<File> {
        return new Promise((resolve, reject) => {
            entry.file((file) => {
                resolve(file);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * Does not read all files in a directory
     *
    function getFileEntriesFromDictionary(entry): Promise<File[]> {
        return new Promise((resolve, reject) => {
            const dirReader = entry.createReader();

            dirReader.readEntries((entries) => {
                resolve(entries);
            }, (error) => {
                reject(error);
            });
        });
    }
     */

    async function handleLoadFiles(files): Promise<any>{
        console.log("handleLoadFiles")
        const items = files;

        let newProject: string | null = null;

        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                if (item.isFile) {
                    try {
                        let file = await getFileFromEntry(item);
                        // @ts-ignore
                        const fileContent = await file.text();
                        let name = file.name;
                        newProject = fileContent
                    } catch (err) {
                        console.log("Error while reading file");
                        console.log(err);
                    }
                } else {
                    console.log("Error: Dropped item is not a file");
                }
            }
        }

        return newProject;
    }

    async function handleDrop(event){
        event.preventDefault();
        console.log("handleDrop")
        console.log(event)
        const data = event.dataTransfer;
        const items = data.items;
        //TODO: handle parse drop single file
        let fileContent = await handleLoadFiles(items);
        await props.loadInputFile(fileContent);

        if(props.onDropComplete){
            await props.onDropComplete();
        }
    }

    const defaultDropZoneContent = (
        <div style={{height: "100%", flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{alignItems: 'center',
                justifyContent: 'center', display: "inline-block", flex: "row"}}>
                <div style={{alignItems: 'center',
                    justifyContent: 'center', display: 'flex'}}>
                    <div style={{display: "inline-block"}}>
                        <i className="pi pi-download" style={{fontSize: "3em"}}/>
                    </div>
                </div>
                <div style={{alignItems: 'center',
                    justifyContent: 'center', display: 'flex'}}>
                    <div style={{display: "inline-block"}}>
                        {"Drop your project here"}
                    </div>
                </div>
            </div>

        </div>
    )

    return(
        <div
            className="dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            style={{display: "flex", flexDirection: "column", flex: 1, backgroundColor: "transparent", height: "100%"}}>
            {props?.children || defaultDropZoneContent}
        </div>
    )
}
