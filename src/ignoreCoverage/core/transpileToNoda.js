
/**
let nodeInfo = {
    id: nodeKey,
    size: node.size,
    edges: graph.edges.filter(edge => edge.from === nodeKey).map(edge => edge.to),
    label: node.label,
    type: node.type,
    text: text,
    color: node.color,
    additional: additional

    node.x = targetMinX + (node.x - minX) * (targetMaxX - targetMinX) / (maxX - minX);
    node.y = targetMinY + (node.y - minY) * (targetMaxY - targetMinY) / (maxY - minY);
    node.z = targetMinZ + (node.z - minZ) * (targetMaxZ - targetMinZ) / (maxZ - minZ);
};
*/

export async function transpileToNoda(calculated){ // list of nodeInfo
    // return csv defined at: https://noda.io/documentation/csv.html

    let nodes = {}
    let calculatedKeys = Object.keys(calculated);
    for (let i = 0; i < calculatedKeys.length; i++) {
        let calculatedKey = calculatedKeys[i];
        let node = calculated[calculatedKey];
        nodes[node.id] = node;
    }

    // Initialize the JSON structure
    let jsonData = {
        "name": "Transpiled",
        "format": "v2",
        "metaNodes": [],
        "metaLinks": [],
        "nodes": [],
        "links": []
    };

    let calculatedKeys = Object.keys(calculated);
    for (let i = 0; i < calculatedKeys.length; i++) {
        let calculatedKey = calculatedKeys[i];
        let node = calculated[calculatedKey];

        let node_type = node.type;

        // Determine the shape based on the node type
        let shape = "Box";
        switch (node.type) {
            case "file": shape = "Ball"; break;
            case "class": shape = "Box"; break;
            case "method": shape = "Tetra"; break;
            case "parameter": shape = "Diamond"; break;
        }

        // Add each node to the JSON
        jsonData.nodes.push({
            "id": 0, // Assuming this is a constant
            "title": null,
            "image": null,
            "kind": null,
            "position": node.position,
            "facing": { "w": 0, "x": 0, "y": 0, "z": 0 }, // Assuming default facing values
            "collapsed": false,
            "folded": false,
            "opacity": 1.0,
            "uuid": node.id,
            "tone": {
                "r": parseInt(node.color.slice(1, 3), 16) / 255.0,
                "g": parseInt(node.color.slice(3, 5), 16) / 255.0,
                "b": parseInt(node.color.slice(5, 7), 16) / 255.0,
                "a": 1.0
            },
            "size": 5.0,
            "shape": shape,
            "properties": [{
                "uuid": "some-unique-uuid", // Generate or assign a unique UUID
                "name": null,
                "text": node.label || "",
                "image": null,
                "video": null,
                "tone": { "r": 0.0, "g": 0.0, "b": 0.0, "a": 1.0 },
                "size": 1.0,
                "page": "",
                "notes": ""
            }]
        });

        let current_level = 0;
        switch (node.type) {
            case "file": current_level = 4; break;
            case "class": current_level = 3; break;
            case "method": current_level = 2; break;
            case "parameter": current_level = 1; break;
        }

        // Add edges as links
        node.edges.forEach(edge => {
            let other_node = nodes[edge];

            let other_level = 0;
            switch (other_node.type) {
                case "file": other_level = 4; break;
                case "class": other_level = 3; break;
                case "method": other_level = 2; break;
                case "parameter": other_level = 1; break;
            }

            let is_outgoing_edge = current_level > other_level;

            if(is_outgoing_edge){
                jsonData.links.push({
                    "id": 0, // Assuming this is a constant
                    "style": null,
                    "title": "",
                    "kind": null,
                    "fromNode": { "id": 0, "Uuid": node.id },
                    "toNode": { "id": 0, "Uuid": edge },
                    "folded": false,
                    "opacity": 1.0,
                    "curve": "None",
                    "trail": "None",
                    "uuid": node.id+"-"+edge, // Generate or assign a unique UUID
                    "tone": { "r": 0.09019608, "g": 0.09019608, "b": 0.09019608, "a": 1.0 },
                    "size": 1.0,
                    "shape": "Solid",
                    "properties": null
                });
            }

        });
    }

    return jsonData;
}


