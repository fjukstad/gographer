var sigRoot = document.getElementById("sig"); 

var graph = sigma.init(sigRoot); 
graph
    .drawingProperties({
        edgeColor: 'source',
        defaultEdgeType: 'curve'
    })
    .graphProperties({
        minNodeSize: 0.5, 
        maxNodeSize: 10,
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
    .draw()
    .startForceAtlas2(); 


// Updates from server
var websocketUrl = "ws://" + window.location.hostname + ":3999/ws"
var socket; 


function initWebSocket(){

        socket = new WebSocket(websocketUrl);
        
        socket.onmessage = function(m) {
            var message = JSON.parse(m.data);
            console.log("Received message:",message); 
            if(message.command == "\"InitGraph\""){
 
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

        }
    }

$(document).ready(function(){
    initWebSocket();
});
