import {getData} from "./exampleData/exampleDataClumpsReport";
import {transpileDataClumpsTypeContextToNodes} from "./transpileDataClumpsTypeContextToNodes";
import {calcPositionOfNodes} from "./calcPositionOfNodes";

export async function test() {
    console.log("Start development")
    let testDataString = getData();
    let testClumps = JSON.parse(testDataString)
    let transpiledAsNodesList = transpileDataClumpsTypeContextToNodes(testClumps);
    let calculated = await calcPositionOfNodes(transpiledAsNodesList)
    console.log(calculated)
}