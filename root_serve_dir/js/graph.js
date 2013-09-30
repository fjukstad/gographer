var graph;

function Graph(el) {

    // Add and remove elements on the graph object
    this.addNode = function (id) {
        var n = findNode( id );
        if ( typeof n != 'undefined' ) {
            console.log( "Attempted to add node which already exists: " + id );
            console.log( n );
            return;
        }
        nodes.push({
            "id": id
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

    this.addLink = function (source, target, value) {
        var s = findNode( source );
        var t = findNode( target );
        if ( typeof s == 'undefined' || typeof t == 'undefined' ) {
            console.log( "Attmepted to add edge between two ids who does not exist." );
            return;
        }
        links.push({
            "source": s,
                "target": t,
                "value": value
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

    // set up the D3 visualisation in the specified element
    var width = 1200,
        height = 800;
    var color = d3.scale.category20();

    var vis = d3.select("#svgdiv")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg")
        .append('svg:g');

    var force = d3.layout.force()
          .charge( -600 )
          .linkDistance( 30 )
          .size([width, height]);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {

        force.nodes(nodes).start();

        var link = vis.selectAll("line")
            .data(links, function (d) {
            return d.source.id + "-" + d.target.id;
        });
        link.enter().append("line")
            .attr("id", function (d) {
            return d.source.id + "-" + d.target.id;
        })
            .style( "stroke-width", 2 )
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
            .attr("r", 10)
            .attr("class", "nodeStrokeClass")
            .style( "fill", function(d) {
                return color(d.id);
            })
            .attr("id", function (d) {
                return "Node;" + d.id;
            });

            /*
        // Add id to node?
        nodeEnter.append("svg:text")
            .attr("class", "textClass")
            .text(function (d) {
            return d.id;
        });
        */

        node.exit()
            .transition()
            .attr("r", 0 )
            .remove();

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
        force.start();
    };

    // Make it all go
    update();
}

function createGraph() {
    graph = new Graph("#svgdiv");

    // Init graph from json 
    d3.json("graph.json", function(error, json){
        for(var i in json.nodes) {
            var n = json.nodes[i];
            //g.addNode( createNodeMap( n.id, n.name, n.group, n.size ) );
            graph.addNode( n.id );
        }
        for (var j in json.edges) {
            var e = json.edges[j];
            //g.addLink( createEdgeMap( e.source, e.target, e.id, e.weight ) );
            graph.addLink( e.source, e.target, e.weight );
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
            //graph.addNode( createNodeMap( message.id, message.name, 0, message.size ) );
            graph.addNode( message.id );
        }
        if(message.command == "\"AddEdge\""){
            //graph.addLink( createEdgeMap( message.source, message.target, message.id, message.weight ) );
            graph.addLink( message.source, message.target, message.weight );
        }
        if (message.command == "\"RemoveNode\"") {
            graph.removeNode(message.id)
        }
        if (message.command == "\"RemoveEdge\"") {
            source = '' + message.source;
            target = '' + message.target;
            id = '' + message.id;
            graph.removeLink( source, target );
        }
    }

    socket.error = function(m){
        console.log("WebSocketError", m.data);
    }

}


var createEdgeMap = function( sourceID, targetID, id, weight ) {
  return { "NodeIDSource": sourceID, "NodeIDTarget": targetID, "EdgeID": id, "Weight": weight };
}

var createNodeMap = function( NodeID, name, group, size ) {
  return { "NodeID": NodeID, "Name": name, "Group": group, "Size": size }
}

$(document).ready(function () {
    initWebSocket();
    createGraph();
});
