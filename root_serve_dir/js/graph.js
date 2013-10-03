function Graph(el) {

    // Add and remove elements on the graph object
    this.addNode = function (id, name) {
        var n = findNode( id );
        if ( typeof n != 'undefined' ) {
            console.log( "Attempted to add node which already exists: " + id );
            console.log( n );
            return;
        }
        nodes.push({
            id: id,
            name: name,
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
            console.log( "Attempted to add edge between two ids who does not exist." );
            return;
        }
        links.push({
            "source": s,
            "target": t,
            "value": value
        });
        update();
    };
    
    this.setNodeName = function(id, name) {
        var i = findNodeIndex(id);
        if ( typeof i == 'undefined' ) {
            console.log( "Attempted to set name of nonexisting node." );
            return;
        }
        nodes[i].name = name;
        
        vis.selectAll("g.node")
        .data(nodes, function (d) {
            return d.id;
        })
        .select("text")
        .text(function (d) {
            return d.name;
        });
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
          .linkDistance( -20 )
          .size([width, height]);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {

        force.nodes(nodes).start();

        var link = vis.selectAll("line")
            .data(links, function (d) {
                return d.source.id + "-" + d.target.id;
            });
        numedges = 0; 
        link.enter().append("line")
            .attr("id", function (d) {
                return d.source.id + "-" + d.target.id;
            })
            .style( "stroke-width", 2 )
            .attr("class", "link");

        console.log("We have",links.length ,"edges"); 
        link.append("title")
            .text(function (d) {
                return d.value;
            });
        link.exit().remove();


        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id;
            });
        
        // Update text element
        /*
        var node_text = node.select("text")
            .text(function (d) {
                return d.name;
            });
        */

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);
        nodeEnter.append("svg:circle")
            .attr("r", 5)
            .attr("class", "nodeStrokeClass")
            .style( "fill", function(d) {
                return color(d.id);
            })
            .attr("id", function (d) {
                return "Node;" + d.id;
            });
        
        // Enter text element
        nodeEnter.append("svg:text")
            .attr("class", "nodeText")
            .attr("dx", 12)
            .attr("dy", ".3em")
            .text(function (d) {
                return d.name;
            });

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

(function($) {
    var graph;
    var websocketUrl = "ws://" + window.location.hostname + ":3999/ws"
    var socket; 
    function initWebSocket(){

        socket = new WebSocket(websocketUrl);
        
        socket.onmessage = function(m) {
            var message = JSON.parse(m.data);
            if(message.command == "\"InitGraph\""){
                json = JSON.parse(JSON.parse(message.graph));
                for(var i in json.nodes) {
                    var n = json.nodes[i];
                    //g.addNode( createNodeMap( n.id, n.name, n.group, n.size ) );
                    graph.addNode( n.id, JSON.parse(n.name) );
                }
                for (var j in json.edges) {
                    var e = json.edges[j];
                    //g.addLink( createEdgeMap( e.source, e.target, e.id, e.weight ) );
                    graph.addLink( e.source, e.target, e.weight );
                }
            }
            if(message.command == "\"AddNode\""){
                //graph.addNode( createNodeMap( message.id, message.name, 0, message.size ) );
                graph.addNode( message.id, JSON.parse(message.name) );
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
            if (message.command == "\"SetNodeName\"") {
                graph.setNodeName( message.id, JSON.parse(message.name) );
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

    $(document).ready(function() {
        graph = new Graph("#svgdiv");
        initWebSocket();
    });
})(jQuery);
