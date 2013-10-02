var sigRoot = document.getElementById("sig"); 

var graph = sigma.init(sigRoot); 
graph
    .drawingProperties({
        edgeColor: 'source',
        defaultEdgeType: 'curve'
    })
    .graphProperties({
        minNodeSize: 0.5, 
        maxNodeSize: 5,
        /*
        minEdgeSize: 30
        */
});

graph
    
    .addNode('hello', {
        id: 1,
        x: 10,
        y: 20,
        label: 'hello',
        color: 'rgb('+Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+')'
    })
        /*
    .addNode('world', {
        id: 2,
        x: 20,
        y: 10,
        label: 'world',
        color: 'rgb('+Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+')'
    })
    .addEdge('hello_world', 'hello', 'world')
    */
    .draw()
    .startForceAtlas2(); 
    


// Updates from server
var websocketUrl = "ws://" + window.location.hostname + ":3999/ws"
var socket; 

function randomColor() {
    return 'rgb('+Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+')';
}

function initWebSocket(){

        socket = new WebSocket(websocketUrl);
        
        socket.onmessage = function(m) {
            var message = JSON.parse(m.data);
            console.log("Received message:",message); 
            if(message.command == "\"InitGraph\""){
                json = JSON.parse(JSON.parse(message.graph));
                for(var i in json.nodes) {
                    var n = json.nodes[i];
                    graph.addNode( n.id, {
                        id: n.id,
                        label: JSON.parse(n.name),
                        x: Math.random()*100,
                        y: Math.random()*100,
                        color: randomColor()
                    });
                }
                for (var j in json.edges) {
                    var e = json.edges[j];
                    graph.addEdge( e.source, e.target, e.weight );
                }


            }
            if(message.command == "\"AddNode\""){
                graph.addNode( message.id, {
                        id: message.id,
                        x: Math.random()*100,
                        y: Math.random()*100,
                        label: JSON.parse(message.name),
                        color: randomColor()
                        
                    });
            }
            if(message.command == "\"AddEdge\""){
                graph.addEdge( message.source, message.target, message.weight );
            }
            if (message.command == "\"RemoveNode\"") {
                graph.dropNode(message.id)
            }
            if (message.command == "\"RemoveEdge\"") {
                source = '' + message.source;
                target = '' + message.target;
                id = '' + message.id;
                graph.dropEdge( source, target );
            }

            graph.startForceAtlas2();

        }
    }

$(document).ready(function(){
    initWebSocket();
});
