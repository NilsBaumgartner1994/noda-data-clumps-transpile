
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

export async function transpileToNodaCsv(calculated){ // list of nodeInfo
    // return csv defined at: https://noda.io/documentation/csv.html

    //console.log(calculated)

    // Define the headers according to Noda's specification
    const headers = [
        "Uuid", "Title", "Notes", "ImageURL", "PageURL", "Color",
        "Opacity", "Shape", "Size", "PositionX", "PositionY", "PositionZ",
        "Collapsed", "Type", "FromUuid", "ToUuid"
    ];

    // Helper function to format a row of data
    const csvRow = (row) => row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(',');

    // Start with the header row
    let csvContent = csvRow(headers) + '\n';
    //console.log("csvContent start")
    //console.log(csvContent)

    // Add each nodeInfo as a row in the CSV
    let caluclatedKeys = Object.keys(calculated);
    for(let i=0; i<caluclatedKeys.length; i++){
        let caluclatedKey = caluclatedKeys[i]
        let node = calculated[caluclatedKey]

        let shape = "Box" // Shape - The shape of the node or the pattern of the link. For nodes the available shapes are: Ball, Box, Tetra, Cylinder, Diamond, Hourglass, Plus, Star. For links the available shapes (patterns) are: Solid, Dash, Arrows
        switch(node.type){
            case "file" : shape = "Ball"; break;
            case "class": shape = "Box"; break;
            case "method": shape = "Tetra"; break;
            case "parameter": shape = "Diamond"; break;
        }

        //console.log(node);

        let row = [
            node.id, 
            node.label, 
            "", 
            "", 
            "", 
            node.color.replace("#", ""),
            1, 
            shape, 
            25, 
            node.position.x, // PositionX,
            node.position.y, // PositionY,
            node.position.z,  // PositionZ,
            "", // Collapsed
            "", // Type
            "", // From
            "" // To
        ];

        //console.log("Add row")
        //console.log(row);

        csvContent += csvRow(row) + '\n';

        //console.log("Row of node added")

        // edges: graph.edges.filter(edge => edge.from === nodeKey).map(edge => edge.to),
        // TODO: create edges also as rows but also add to csvContent

        // Assuming edges are an array of { from: <nodeId>, to: <nodeId> }
        node.edges.forEach(edge => {
            const edgeRow = [
                node.id+"-"+edge, // Uuid
                 "", // Title 
                 "", // Nodes
                 "", // ImageURL
                 "", // PageURL 
                 "000000", // Color
                 1, // Size 
                 "Solid", // Shape 
                 5, 
                 "", 
                 "", 
                 "",
                 "", 
                 "", 
                node.id, // FromUuid
                edge // ToUuid
            ];

            //console.log("edgeRow");
            //console.log(edgeRow)

            csvContent += csvRow(edgeRow) + '\n';
        });

    };

    return csvContent;
}

