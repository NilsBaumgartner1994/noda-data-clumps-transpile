
import * as d3 from 'd3-force-3d';

export function getVrBounds(){
    let radius = 0.5
    let yOffset = 0.5
    let zOffset = 0.5
    const bounds = {
        x: { min: -radius, max: radius },
        y: { min: yOffset+0, max: yOffset+radius+radius },
        z: { min: zOffset+0, max: zOffset+radius+radius}
    };
    return bounds;
}

function normalizeNodePositions(nodes, bounds) {
    console.log("Normalize Node Positions");

    // Compute the bounding box of the node positions
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    nodes.forEach(node => {
        if (node.x < minX) minX = node.x;
        if (node.x > maxX) maxX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.y > maxY) maxY = node.y;
        if (node.z < minZ) minZ = node.z;
        if (node.z > maxZ) maxZ = node.z;
    });

    let targetMinX = bounds?.x?.min !== undefined ? bounds.x.min : minX;
    let targetMaxX = bounds?.x?.max !== undefined ? bounds.x.max : maxX;
    let targetMinY = bounds?.y?.min !== undefined ? bounds.y.min : minY;
    let targetMaxY = bounds?.y?.max !== undefined ? bounds.y.max : maxY;
    let targetMinZ = bounds?.z?.min !== undefined ? bounds.z.min : minZ;
    let targetMaxZ = bounds?.z?.max !== undefined ? bounds.z.max : maxZ;

    console.log(`minX: ${minX}, targetMinX: ${targetMinX}`);
    console.log(`maxX: ${maxX}, targetMaxX: ${targetMaxX}`);
    console.log(`minY: ${minY}, targetMinY: ${targetMinY}`);
    console.log(`maxY: ${maxY}, targetMaxY: ${targetMaxY}`);
    console.log(`minZ: ${minZ}, targetMinZ: ${targetMinZ}`);
    console.log(`maxZ: ${maxZ}, targetMaxZ: ${targetMaxZ}`);

    // Calculate scaling ratios for each dimension
    let ratioX = (targetMaxX - targetMinX) / (maxX - minX);
    let ratioY = (targetMaxY - targetMinY) / (maxY - minY);
    let ratioZ = (targetMaxZ - targetMinZ) / (maxZ - minZ);

    // Find the smallest ratio
    let smallestRatio = Math.min(ratioX, ratioY, ratioZ);

    // Compute the node size based on the smallest scaling ratio
    let nodeSize = 30 * smallestRatio; 

    // Remap the positions
    nodes.forEach(node => {
        node.x = targetMinX + (node.x - minX) * (targetMaxX - targetMinX) / (maxX - minX);
        node.y = targetMinY + (node.y - minY) * (targetMaxY - targetMinY) / (maxY - minY);
        node.z = targetMinZ + (node.z - minZ) * (targetMaxZ - targetMinZ) / (maxZ - minZ);
        node.size = nodeSize
    });
}


function checkForMalformedNodes(data) {
    // Check for undefined data keys and duplicate IDs
    const nodeIdCounts = {};
    const nodeIds = new Set();
    
    for (let key of Object.keys(data)) {
        if (!data[key]) {
            console.log("No data for key:", key);
            //exit(1);
            return
        }
        nodeIdCounts[key] = (nodeIdCounts[key] || 0) + 1;
        nodeIds.add(key);
    }

    for (const id in nodeIdCounts) {
        if (nodeIdCounts[id] > 1) {
            console.log(`Duplicate node ID detected: ${id}`);
            //exit(1);
            return
        }
    }

    return nodeIds;
}

function getExampleGraph() {
    // Sample graph for testing purposes
    return {
        "Alice.java": {
            id: "Alice.java",
            edges: ["Bob", "Charlie", "Draco"]
        },
        "Bob": {
            id: "Bob",
            edges: ["Alice.java", "Charlie", "Draco"]
        },
        "Charlie": {
            id: "Charlie",
            edges: ["Alice.java", "Bob", "Draco"]
        },
        "Draco": {
            id: "Draco",
            edges: ["Alice.java", "Bob", "Charlie"]
        },
        "Emil": {
            id: "Emil",
            edges: []
        }
    };
}

function extractNodesAndLinks(data) {
    // Extract nodes and links from the data
    const nodes = [];
    const links = [];
    
    for (let key of Object.keys(data)) {
        let node = {...data[key], id: key};
        nodes.push(node);
        node.edges.forEach(edge => {
            links.push({
                source: node.id,
                target: edge
            });
        });
    }

    return { nodes, links };
}

function runSimulation(nodes, links, data){
    console.log("Amount Nodes: "+nodes.length);

    const numDimensions = 3;
    const maxIterations = 1000;
    const velocityThreshold = 0.1;
    let steadyTicks = 0;
    const alphaTarget = 0.001;

    const simulation = d3.forceSimulation(nodes, numDimensions)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter())
        .alphaTarget(alphaTarget); // Set a small alpha target to keep the simulation "warm"

    for (let i = 0; i < maxIterations; i++) {
        simulation.tick();

        // Calculate average velocity of nodes
        let totalVelocity = 0;
        for (const node of nodes) {
            const vx = node.vx || 0;
            const vy = node.vy || 0;
            const vz = node.vz || 0;

            const velocityMagnitude = Math.sqrt(vx*vx + vy*vy + vz*vz);
            totalVelocity += velocityMagnitude;
        }

        const avgVelocity = totalVelocity / nodes.length;

        console.log("Step: "+i, "Avg Velocity:", avgVelocity);

        // If average velocity is below threshold for a certain number of ticks, consider the simulation "steady"
        if (avgVelocity < velocityThreshold) {
            steadyTicks++;
            if (steadyTicks > 5) {
                console.log("Nodes are steady. Stopping simulation.");
                break;
            }
        } else {
            steadyTicks = 0; // Reset if nodes start moving again
        }
    }

    console.log("Simulation finished");
}


function setPositionAndSizeToData(nodes, data){
            // Set the positions of nodes after simulation
        nodes.forEach(node => {

            /**
            if (node.size === 4) {
                node.x = 100;
                node.y = 100;
                node.z = 100;
            }
            */
            
            // Add position to original data structure
            data[node.id].position = {
                x: node.x || 0,
                y: node.y || 0,
                z: node.z || 0,
            };
            data[node.id].size = node.size
        });

        console.log("Data Nodes");
        //console.log(data);
}


export async function calcPositionOfNodes(data, bounds) {
    console.log("Start calcPositionOfNodes");
    let copy = JSON.parse(JSON.stringify(data))
    const nodeIds = checkForMalformedNodes(copy);
    const { nodes, links } = extractNodesAndLinks(copy);
    runSimulation(nodes, links, copy);
    if(!bounds){
        bounds = getVrBounds();
    }
    normalizeNodePositions(nodes, bounds);
    setPositionAndSizeToData(nodes, copy);
    return copy;

}