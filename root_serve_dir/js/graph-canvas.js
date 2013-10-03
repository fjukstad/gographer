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

    // Does not work with canvas
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

    var color = d3.scale.category20();
    var width = 1200,
        height = 800;

    var canvas = d3.select("body").append("canvas")
                    .attr("width", width)
                    .attr("height", height); 

    canvas.node().addEventListener("mousemove", mousemove); 
    canvas.node().addEventListener("mousedown", mousedown); 
    canvas.node().addEventListener("mouseup", mouseup); 

    var force = d3.layout.force()
          .charge( -200 )
          .linkDistance( -20 )
          .size([width, height]);


    var nodes = force.nodes(),
        links = force.links();
    
    var context = canvas.node().getContext("2d");

    var update = function () {

        force.nodes(nodes).on("tick", tick).start(); 
        
        function tick() {
            context.clearRect(0,0,width,height); 
            
            context.beginPath();
            context.strokeStyle = "#ccc";
            
            // Draw edges
            links.forEach(function(d,i){
                context.moveTo(d.source.x, d.source.y);
                context.lineTo(d.target.x, d.target.y); 
            }); 
            context.stroke(); 

            // Draw nodes
            context.beginPath();
            nodes.forEach(function(d,i) {
                context.fillStyle = color(d);
                context.arc(d.x, d.y, 4.5, 0, 2 * Math.PI);

                // label
                context.fillText(d.name, d.x + 10, d.y); 
                
            });

             context.fill(); 

            
        }

        // Restart the force layout.
        force.start();
    }

    // Make it all go
    update();

    isDrag = false


    function mousemove(e){
        if(isDrag) {
            console.log("DRAGGING MOUSE"); 
        }
    }

    function mousedown(e){
        isDrag = true
        console.log("MOUSE DOWN AT: ", e); 
        for (var i in nodes) {
            offset = 5;
            n = nodes[i];
            // x-axis
            if( n.x - offset < e.x){
                if(e.x < n.x + offset){
                    // y-axis
                    console.log("hit on x-axis"); 
                    console.log(n.y, e.y); 
                    if (n.y - offset < e.y){
                        if(e.y < n.y + offset) {
                            console.log("HIT:", n);
                        }
                    }
                }
            }


        }
    }

    function mouseup(e){
        console.log("STOPPED DRAG!"); 
        isDrag = false;
    }



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



