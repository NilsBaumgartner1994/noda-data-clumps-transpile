function getInitialGraphFromDataClumpsDict(dataClumpsDict){
    //console.log("getInitialGraphFromDataClumpsDict");

    let files_dict = {};
    let classes_dict = {};
    let fields_dict = {};
    let methods_dict = {};
    let parameters_dict = {};

    if(dataClumpsDict){

        let dataClumps = dataClumpsDict?.data_clumps || {};
        let dataClumpsKeys = Object.keys(dataClumps);
        for(let dataClumpKey of dataClumpsKeys){
            let dataClump = dataClumps[dataClumpKey];
            let data_clump_data_dict = dataClump.data_clump_data;
            let dataClumpDataKeys = Object.keys(data_clump_data_dict);
            for(let dataClumpDataKey of dataClumpDataKeys){
                let dataClumpData = data_clump_data_dict[dataClumpDataKey];
                initNodesForDataClumpData(dataClump, dataClumpData, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict);
            }
        }
    }

    let nodes = [];
    let edges = [];

    let graph = {
        nodes: nodes,
        edges: edges
    }

    let files_dict_keys = Object.keys(files_dict);
    for(let file_dict_key of files_dict_keys){
        let file_dict_value = files_dict[file_dict_key];
        // @ts-ignore
        graph.nodes.push(file_dict_value);
        let classes_or_interfaces_ids = file_dict_value.classes_or_interfaces_ids;
        let classes_or_interfaces_ids_keys = Object.keys(classes_or_interfaces_ids);
        for(let classes_or_interfaces_ids_key of classes_or_interfaces_ids_keys){
            graph.edges.push({
                // @ts-ignore
                from: file_dict_value.id,
                // @ts-ignore
                to: classes_or_interfaces_ids_key,
            });
        }
    }

    let classes_dict_keys = Object.keys(classes_dict);
    for(let class_dict_key of classes_dict_keys){
        let class_dict_value = classes_dict[class_dict_key];
        // @ts-ignore
        graph.nodes.push(class_dict_value);
        let field_ids = class_dict_value.field_ids;
        let field_ids_keys = Object.keys(field_ids);
        for(let field_ids_key of field_ids_keys){
            graph.edges.push({
                // @ts-ignore
                from: class_dict_value.id,
                // @ts-ignore
                to: field_ids_key,
            });
        }

        let method_ids = class_dict_value.method_ids;
        let method_ids_keys = Object.keys(method_ids);
        for(let method_ids_key of method_ids_keys){
            graph.edges.push({
                // @ts-ignore
                from: class_dict_value.id,
                // @ts-ignore
                to: method_ids_key,
            });
        }
    }

    let fields_dict_keys = Object.keys(fields_dict);
    for(let field_dict_key of fields_dict_keys){
        let field_dict_value = fields_dict[field_dict_key];
        // @ts-ignore
        graph.nodes.push(field_dict_value);

        let related_to = field_dict_value.related_to;
        let related_to_keys = Object.keys(related_to);
        for(let related_to_key of related_to_keys){
            graph.edges.push({
                // @ts-ignore
                from: field_dict_value.id,
                // @ts-ignore
                to: related_to_key,
            });
        }
    }

    let method_ids = Object.keys(methods_dict);
    for(let method_id of method_ids){
        let method_dict_value = methods_dict[method_id];
        // @ts-ignore
        graph.nodes.push(method_dict_value);
        let parameter_ids = method_dict_value.parameter_ids;
        let parameter_ids_keys = Object.keys(parameter_ids);
        for(let parameter_ids_key of parameter_ids_keys){
            graph.edges.push({
                // @ts-ignore
                from: method_dict_value.id,
                // @ts-ignore
                to: parameter_ids_key,
            });
        }
    }

    let parameters_dict_keys = Object.keys(parameters_dict);
    for(let parameter_dict_key of parameters_dict_keys){
        let parameter_dict_value = parameters_dict[parameter_dict_key];
        // @ts-ignore
        graph.nodes.push(parameter_dict_value);

        let related_to = parameter_dict_value.related_to;
        let related_to_keys = Object.keys(related_to);
        for(let related_to_key of related_to_keys){
            graph.edges.push({
                // @ts-ignore
                from: parameter_dict_value.id,
                // @ts-ignore
                to: related_to_key,
            });
        }
    }

    return graph;
}

function getRawFileNode(filePath, filesDict) {
    let fileNode = filesDict[filePath];
    let fileName = filePath;

    try {
        fileName = filePath.split("/").pop();
    } catch (e) {
        // could not split filePath, so just use filePath as fileName
    }

    if (!fileNode) {
        fileNode = {
            id: filePath,
            label: fileName,
            color: "#636363",
            size: 4,
            type: "file",
            classes_or_interfaces_ids: {}
        };
        filesDict[fileNode.id] = fileNode;
    }

    return fileNode;
}

function getRawClassesOrInterfacesNode(classOrInterfaceKey, classOrInterfaceName, classesDict) {
    let classOrInterfaceNode = classesDict[classOrInterfaceKey];

    if (!classOrInterfaceNode) {
        classOrInterfaceNode = {
            id: classOrInterfaceKey,
            label: classOrInterfaceName,
            color: "#6D6921",
            size: 3,
            type: "class",
            field_ids: {},
            method_ids: {}
        };
        classesDict[classOrInterfaceNode.id] = classOrInterfaceNode;
    }

    return classOrInterfaceNode;
}

function getRawMethodNode(methodKey, methodName, methodsDict) {
    let methodNode = methodsDict[methodKey];

    if (!methodNode) {
        methodNode = {
            id: methodKey,
            label: methodName,
            color: "#CBCBAE",
            size: 2,
            type: "method",
            font: {color: '#000000'},
            parameter_ids: {}
        };
        methodsDict[methodNode.id] = methodNode;
    }

    return methodNode;
}

function getRawParameterNode(parameterKey, parameterName, parametersDict) {
    let parameterNode = parametersDict[parameterKey];

    if (!parameterNode) {
        parameterNode = {
            id: parameterKey,
            label: parameterName,
            color: "#F6E146",
            size: 1,
            type: "parameter",
            related_to: {}
        };
        parametersDict[parameterNode.id] = parameterNode;
    }

    return parameterNode;
}

function createRawLinkBetweenParameterOrFieldNodes(fieldNode, relatedToFieldNode) {
    fieldNode.related_to[relatedToFieldNode.id] = relatedToFieldNode.id;
    relatedToFieldNode.related_to[fieldNode.id] = fieldNode.id;
}




function initNodesForDataClumpData(dataClumpHolder, dataClumpData, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict){

    let data_clump_type = dataClumpHolder.data_clump_type;
    if(data_clump_type==="parameters_to_parameters_data_clump"){
        //console.log("parameter_data_clump")
        //console.log(dataClumpData);

        let file_path_from = dataClumpHolder.from_file_path;
        let file_node_from = getRawFileNode(file_path_from, files_dict);

        let classOrInterfaceKey_from = dataClumpHolder.from_class_or_interface_key;
        let classOrInterfaceName_from = dataClumpHolder.from_class_or_interface_name;

        let class_or_interface_node_from = getRawClassesOrInterfacesNode(classOrInterfaceKey_from, classOrInterfaceName_from, classes_dict);
        file_node_from.classes_or_interfaces_ids[class_or_interface_node_from.id] = class_or_interface_node_from.id;

        let file_path_to = dataClumpHolder.to_file_path;
        let file_node_to = getRawFileNode(file_path_to, files_dict);

        let classOrInterfaceKey_to = dataClumpHolder.to_class_or_interface_key;
        let classOrInterfaceName_to = dataClumpHolder.to_class_or_interface_name;

        let class_or_interface_node_to = getRawClassesOrInterfacesNode(classOrInterfaceKey_to, classOrInterfaceName_to, classes_dict);
        file_node_to.classes_or_interfaces_ids[class_or_interface_node_to.id] = class_or_interface_node_to.id;


        let method_key_from = dataClumpHolder.from_method_key+"";
        let method_name_from = dataClumpHolder.from_method_name+"";
        let method_node_from = getRawMethodNode(method_key_from, method_name_from, methods_dict);
        class_or_interface_node_from.method_ids[method_node_from.id] = method_node_from.id;

        let method_key_to = dataClumpHolder.to_method_key+"";
        let method_name_to = dataClumpHolder.to_method_name+"";
        let method_node_to = getRawMethodNode(method_key_to, method_name_to, methods_dict);
        class_or_interface_node_to.method_ids[method_node_to.id] = method_node_to.id;


        let parameter_key_from = dataClumpData.key;
        let parameter_name_from = dataClumpData.name;
        let parameter_node_from = getRawParameterNode(parameter_key_from, parameter_name_from, parameters_dict);
        method_node_from.parameter_ids[parameter_node_from.id] = parameter_node_from.id;

        let parameter_key_to = dataClumpData.to_variable.key;
        let parameter_name_to = dataClumpData.to_variable.name;
        let parameter_node_to = getRawParameterNode(parameter_key_to, parameter_name_to, parameters_dict);
        method_node_from.parameter_ids[parameter_node_to.id] = parameter_node_to.id;

        createRawLinkBetweenParameterOrFieldNodes(parameter_node_from, parameter_node_to);

    }

    else if(data_clump_type==="fields_to_fields_data_clump"){

        let file_path_from = dataClumpHolder.from_file_path;
        let file_node_from = getRawFileNode(file_path_from, files_dict);

        let classOrInterfaceKey_from = dataClumpHolder.from_class_or_interface_key;
        let classOrInterfaceName_from = dataClumpHolder.from_class_or_interface_name;

        let class_or_interface_node_from = getRawClassesOrInterfacesNode(classOrInterfaceKey_from, classOrInterfaceName_from, classes_dict);
        file_node_from.classes_or_interfaces_ids[class_or_interface_node_from.id] = class_or_interface_node_from.id;

        let file_path_to = dataClumpHolder.to_file_path;
        let file_node_to = getRawFileNode(file_path_to, files_dict);

        let classOrInterfaceKey_to = dataClumpHolder.to_class_or_interface_key;
        let classOrInterfaceName_to = dataClumpHolder.to_class_or_interface_name;

        let class_or_interface_node_to = getRawClassesOrInterfacesNode(classOrInterfaceKey_to, classOrInterfaceName_to, classes_dict);
        file_node_to.classes_or_interfaces_ids[class_or_interface_node_to.id] = class_or_interface_node_to.id;


        let parameter_key_from = dataClumpData.key;
        let parameter_name_from = dataClumpData.name;
        let parameter_node_from = getRawParameterNode(parameter_key_from, parameter_name_from, parameters_dict);
        class_or_interface_node_from.field_ids[parameter_node_from.id] = parameter_node_from.id;

        let parameter_key_to = dataClumpData.to_variable.key;
        let parameter_name_to = dataClumpData.to_variable.name;
        let parameter_node_to = getRawParameterNode(parameter_key_to, parameter_name_to, parameters_dict);
        class_or_interface_node_to.field_ids[parameter_node_to.id] = parameter_node_to.id;

        createRawLinkBetweenParameterOrFieldNodes(parameter_node_from, parameter_node_to);

    } else if(data_clump_type==="parameters_to_fields_data_clump"){

        let file_path_from = dataClumpHolder.from_file_path;
        let file_node_from = getRawFileNode(file_path_from, files_dict);

        let classOrInterfaceKey_from = dataClumpHolder.from_class_or_interface_key;
        let classOrInterfaceName_from = dataClumpHolder.from_class_or_interface_name;

        let class_or_interface_node_from = getRawClassesOrInterfacesNode(classOrInterfaceKey_from, classOrInterfaceName_from, classes_dict);
        file_node_from.classes_or_interfaces_ids[class_or_interface_node_from.id] = class_or_interface_node_from.id;

        let file_path_to = dataClumpHolder.to_file_path;
        let file_node_to = getRawFileNode(file_path_to, files_dict);

        let classOrInterfaceKey_to = dataClumpHolder.to_class_or_interface_key;
        let classOrInterfaceName_to = dataClumpHolder.to_class_or_interface_name;

        let class_or_interface_node_to = getRawClassesOrInterfacesNode(classOrInterfaceKey_to, classOrInterfaceName_to, classes_dict);
        file_node_to.classes_or_interfaces_ids[class_or_interface_node_to.id] = class_or_interface_node_to.id;


        let method_key_from = dataClumpHolder.from_method_key+"";
        let method_name_from = dataClumpHolder.from_method_name+"";
        let method_node_from = getRawMethodNode(method_key_from, method_name_from, methods_dict);
        class_or_interface_node_from.method_ids[method_node_from.id] = method_node_from.id;


        let parameter_key_from = dataClumpData.key;
        let parameter_name_from = dataClumpData.name;
        let parameter_node_from = getRawParameterNode(parameter_key_from, parameter_name_from, parameters_dict);
        method_node_from.parameter_ids[parameter_node_from.id] = parameter_node_from.id;

        let parameter_key_to = dataClumpData.to_variable.key;
        let parameter_name_to = dataClumpData.to_variable.name;
        let parameter_node_to = getRawParameterNode(parameter_key_to, parameter_name_to, parameters_dict);
        class_or_interface_node_to.field_ids[parameter_node_to.id] = parameter_node_to.id;

        createRawLinkBetweenParameterOrFieldNodes(parameter_node_from, parameter_node_to);


    }
}

function getNodesInfo(graph) {
    let nodesInfo = {};

    for (let node of graph.nodes) {
        if (typeof node === 'object' && node !== null) {
            let nodeKey = node.id;  // Assuming 'id' is a unique identifier for each node
            let text = node.label;
            let additional = node.label;

            for (let edge of graph.edges) {
                if (edge.from === nodeKey) {
                    if (edge.to == null) {
                        console.error(`Edge with missing or null 'to' attribute: ${JSON.stringify(edge)}`);
                        process.exit(1);
                    } else if (edge.from == null) {
                        console.error(`Edge with missing or null 'from' attribute: ${JSON.stringify(edge)}`);
                        process.exit(1);
                    }
                }
            }

            let nodeInfo = {
                id: nodeKey,
                size: node.size,
                edges: graph.edges.filter(edge => edge.from === nodeKey).map(edge => edge.to),
                label: node.label,
                type: node.type,
                text: text,
                color: node.color,
                additional: additional
            };

            nodesInfo[nodeKey] = nodeInfo;
        }
    }

    return nodesInfo;
}


export function transpileDataClumpsTypeContextToNodes(data_clumps_dict){
    let graph = getInitialGraphFromDataClumpsDict(data_clumps_dict)
    let nodes_info = getNodesInfo(graph)
    return nodes_info;
}