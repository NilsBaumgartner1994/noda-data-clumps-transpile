import {ExampleDataArgoUML} from "./ExampleDataArgoUML";
import {ExampleTestData} from "./ExampleTestData";

export class ExampleData{
    static getArgoUML(){
        return ExampleDataArgoUML.getDataClumpsDict();
    }

    static getTestData(){
        return ExampleTestData.getDataClumpsDict();
    }
}
