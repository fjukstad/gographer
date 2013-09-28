// Graph object
var g; 



/*
// Mapping from NodeID to the rest of node properties
var Nodes = {};
// List of maps with (Source, Target, ID) relative to NodeID
var Edges = [];

// Incremental ID used to assign relative index id to each node
var currentNodeIDIndex = 0;
// Mapping of NodeID to relative index id
var mapNodeIDToIndex = {};

// List of maps with (nodeId, id) - where id is the index and nodeId is the proper ID
// Must be rebuild everytime a node is removed
var nodesByIndex = force.nodes();
// List of maps with (source, target, weight) where source and target are index ids
// Must be rebuild everytime a node or link(inplace removal?) is removed
var edgesByIndex = force.links();
*/
function graph(el){



  /*
    this.addNode= function( mapOfNode ) {

        if (Nodes.hasOwnProperty( mapOfNode["NodeID"] ) ) {
            // the node already exists!
            console.log( "Attempting to already existing node id: ", mapOfNode["NodeID"] );
            return;
        }

        Nodes[ mapOfNode["NodeID"] ] = mapOfNode;
        nodesByIndex.push( createNodeMapForIndex( currentNodeIDIndex, mapOfNode["NodeID"] ) );
        mapNodeIDToIndex[ mapOfNode["NodeID"] ] = currentNodeIDIndex;
        currentNodeIDIndex++;

        drawGraph(); 
    }

    this.addLink = function( edge ) {

        if ( !Nodes.hasOwnProperty( edge["NodeIDSource"] ) ) {
            console.log( "Attempted to add edge from NodeID: "+ edge["NodeIDSource"] +
                          " to NodeID: " + edge["NodeIDTarget"] +". Does not exist in Nodes map" );
            return;
        }
        if ( !Nodes.hasOwnProperty( edge["NodeIDTarget"] ) ) {
            console.log( "Attempted to add edge between non-existant NodeID" );
            return;
        }

        if ( Edges.indexOf( edge ) > -1 ) {
            console.log( "Attempted to add an edge between two nodes that already has unique edge id: ", edge["id"] );
            return;
        }
        
        Edges.push( edge );
        var s = mapNodeIDToIndex[ edge["NodeIDSource"] ];
        var t = mapNodeIDToIndex[ edge["NodeIDTarget"] ];

        map =  createEdgeMapForIndex( s, t, edge["EdgeID"], edge["Weight"]);
        edgesByIndex.push( map );

        drawGraph(); 
    }

    this.removeLink = function(source, target, id) {
        if ( !Nodes.hasOwnProperty( source ) ) {
            console.log( "Attmpted to remove an edge on non-existant source node." );
            return;
        }
        if ( !Nodes.hasOwnProperty( target ) ) {
            console.log( "Attempted to remove an edge on non-existant target node." ); 
            return;
        }

        var edgeExists = false;
        for (var i in Edges) {
          if (  ( Edges[i]["NodeIDSource"] == source ) && 
                ( Edges[i]["NodeIDTarget"] == target ) && ( Edges[i]["EdgeID"] == id ) ) {
            edgeExists = true;
            Edges.splice( i, 1 );
            break;
          }
        }
        if ( !edgeExists ) {
            console.log( "ERROR: Attempted to remove non-existant edge between NodeIDs: "+
                          source + "->" + target + "["+id+"]" );
            console.log( "Printing contents of Edges:" );
            console.log( Edges );
            return;
        }

        // Remove it from edgesByIndex
        for ( var i in edgesByIndex ) {
            if (  ( edgesByIndex[i]["source"]["index"] == mapNodeIDToIndex[ source ] ) &&
                  ( edgesByIndex[i]["target"]["index"] == mapNodeIDToIndex[ target ] ) &&
                  ( edgesByIndex[i]["edgeid"] == id ) ) {
                edgesByIndex.splice( i, 1 );
                break;
            }
        }

        drawGraph(); 
    }

    this.removeNode = function(id) {

        if ( !Nodes.hasOwnProperty( id ) ) {
            console.log( "ERROR: Attempted to remove non-existant NodeID " + id );
            return;
        }

        delete Nodes[id];

        var removedIndex = -1;
        for ( var i in nodesByIndex ) {
          if ( nodesByIndex[i]["NodeID"] == id ) {
            nodesByIndex.splice( i, 1 );
            removedIndex = i; 
            break;
          }
        }
        if ( removedIndex == -1 ) {
            console.log( "ERROR: Failed to locate correct NodeID in index" );
            return;
        }

        var i = 0;
        var n = mapNodeIDToIndex[ id ];

        drawGraph(); 

    }
*/

    // Add and remove elements on the graph object
    this.addNode = function (NodeMap) {
        console.log( "Adding node" );
        nodes.push({
            "id": NodeMap.NodeID
        });
        update();
    };

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                links.splice(i, 1);
            } else i++;
        }
        nodes.splice(findNodeIndex(id), 1);
        update();
    };

    this.removeLink = function (source, target) {
        for (var i = 0; i < links.length; i++) {
            if (
            links[i].source.id == source && links[i].target.id == target) {
                links.splice(i, 1);
                break;
            }
        }
        update();
    };

    this.removeallLinks = function () {
        links.splice(0, links.length);
        update();
    };

    this.removeAllNodes = function () {
        nodes.splice(0, links.length);
        update();
    };

    this.addLink = function (EdgeMap) {
        links.push({
            "source": findNode(EdgeMap.NodeIDSource),
                "target": findNode(EdgeMap.NodeIDTarget),
                "value": EdgeMap.weight
        });
        update();
    };

    var findNode = function (id) {
        for (var i in nodes) {
            if (nodes[i]["id"] === id) return nodes[i];
        };
    };

    var findNodeIndex = function (id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == id) {
                return i;
            }
        };
    };

    /*

  // set up the D3 visualisation in the specified element
    var w = 500,
        h = 500;
    var vis = d3.select("#svgdiv")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "svg")
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("perserveAspectRatio", "xMinYMid")
        .append('svg:g');

    var force = d3.layout.force();

    var nodes = force.nodes(),
        links = force.links();

    var link = vis.selectAll(".link");
    var node = vis.selectAll(".node");

    var update = function () {

        var link = vis.selectAll("line")
            .data(links, function (d) {
            return d.source.id + "-" + d.target.id;
        });
        link.enter().append("line")
            .attr("id", function (d) {
            return d.source.id + "-" + d.target.id;
        })
            .attr("class", "link");
        link.append("title")
            .text(function (d) {
            return d.value;
        });
        link = link.data(links);
        link.enter().insert("line")
            .attr("class", "link")
            .style("stroke-width", 2); 
        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
            return d.id;
        });
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);
        nodeEnter.append("svg:circle")
            .attr("r", 16)
            .attr("id", function (d) {
            return "Node;" + d.id;
        })
            .attr("class", "nodeStrokeClass");
        nodeEnter.append("svg:text")
            .attr("class", "textClass")
            .text(function (d) {
            return d.id;
        });
        node.exit().remove();
        force.on("tick", function () {
            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                return d.source.y;
            })
                .attr("x2", function (d) {
                return d.target.x;
            })
                .attr("y2", function (d) {
                return d.target.y;
            });
        });

        // Restart the force layout.
        force.gravity(.05)
            .distance(50)
            .linkDistance(50)
            .size([w, h])
            .start();
    };

    // Make it all go
    update();
*/

/*

    var width = 500,
        height = 500; 

    var color = d3.scale.category20(); 

    var force = d3.layout.force()
        .charge(-50)
        .linkDistance(30)
        .size([width,height]);

    var vis = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height); 


    var nodes = force.nodes(),
        links = force.links();

    var update = function () {
        var link = vis.selectAll("line")
            .data(links, function (d) {
            return d.source.id + "-" + d.target.id;
        });
        link.enter().append("line")
            .attr("id", function (d) {
            return d.source.id + "-" + d.target.id;
        })
            .attr("class", "link");
        link.append("title")
            .text(function (d) {
            return d.value;
        });
        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
            return d.id;
        });
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);
        nodeEnter.append("svg:circle")
            .attr("r", 16)
            .attr("id", function (d) {
            return "Node;" + d.id;
        })
            .attr("class", "nodeStrokeClass");
        nodeEnter.append("svg:text")
            .attr("class", "textClass")
            .text(function (d) {
            return d.id;
        });
        node.exit().remove();

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        });


        // Restart the force layout.
        force.start();
    };

    update();
*/

}
// TEST
var width = 500,
    height = 500; 

var color = d3.scale.category20(); 

var force = d3.layout.force()
    .charge(-50)
    .linkDistance(30)
    .size([width,height])
    .on("tick", tick); 

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height); 


var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");  

var nodes = force.nodes(),
    links = force.links(); 

function update() {

    force.nodes(nodes) 
        .start(); 

    link = link.data(links);
    link.enter().insert("line")
        .attr("class", "link")
        .style("stroke-width", 2); 
    
    //svg.selectAll(".link").exit().remove()
    link.exit().remove(); 

    node = node.data(nodes);
    node.enter().insert("circle")
        .attr("class", "node")
        .attr("r", 5) 
        .style("fill", function(d){
            return color(d.id);
        })
        .call(force.drag);

        node.append("title")
            .text(function(d) {
                return d.id;
            }); 
    node.exit()
        .transition()
        .attr("r", 0)
        .remove()

}

function tick(){
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}






var createEdgeMapForIndex = function( sourceID, targetID, edgeid, weight ) {
  return { "source": sourceID, "target": targetID, "edgeid": edgeid, "weight": weight };
}

var createEdgeMap = function( sourceID, targetID, id, weight ) {
  return { "NodeIDSource": sourceID, "NodeIDTarget": targetID, "EdgeID": id, "Weight": weight };
}

var createNodeMap = function( NodeID, name, group, size ) {
  return { "NodeID": NodeID, "Name": name, "Group": group, "Size": size }
}

var createNodeMapForIndex = function( id, NodeID ) {
  return { "id": id, "NodeID": NodeID }
}


function createGraph() {
    g = new graph();

    // Init graph from json 
    d3.json("graph.json", function(error, graph){
        for(i in graph.nodes) {
            n = graph.nodes[i];
            g.addNode( createNodeMap( n.id, n.name, n.group, n.size ) );
        }
        for (j in graph.edges) {
            e = graph.edges[j];
            g.addLink( createEdgeMap( e.source, e.target, e.id, e.weight ) );
        }
    }); 
}


var websocketUrl = "ws://localhost:3999/ws"
var socket; 
function initWebSocket(){

    socket = new WebSocket(websocketUrl);
    
    socket.onmessage = function(m) {
        var message = JSON.parse(m.data);  
        if(message.command == "\"AddNode\""){
            g.addNode( createNodeMap( message.id, message.name, 0, message.size ) );
        }
        if(message.command == "\"AddEdge\""){
            g.addLink( createEdgeMap( message.source, message.target, message.id, message.weight ) );
        }
        if (message.command == "\"RemoveNode\"") {
            g.removeNode(message.id)
        }
        if (message.command == "\"RemoveEdge\"") {
            source = '' + message.source;
            target = '' + message.target;
            id = '' + message.id;
            g.removeLink( source, target, id );
        }

    }

    socket.error = function(m){
        console.log("WebSocketError", m.data);
    }

}



$(document).ready(function () {
    initWebSocket(); 
    createGraph();
});

