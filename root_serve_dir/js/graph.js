var g; 

function graph(el){

    this.addNode= function(id) {
        nodes.push({"id":id}); 
        drawGraph(); 
    }

    this.addLink = function(source,target,value) {
        s = findNode(source);
        t = findNode(target);
        
        // These two ensure that there are no errors when
        // adding an edge due to undefined source
        // or target 
        if (typeof s == 'undefined'){
            return;
        }
        else if (typeof t == 'undefined') {
            return; 
        }
        else{
            links.push({"source":s, "target":t, "value":value}); 
            drawGraph(); 
        }
    }


}

var findNode = function(id) {

    for(var i in nodes) {
        
        if(nodes[i]["id"] == id){
            return nodes[i];
        }
    }
}


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

function drawGraph() {

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

function createGraph() {
    g = new graph();

    // Init graph from json 
    d3.json("graph.json", function(error, graph){
        for(i in graph.nodes) {
            new_node = graph.nodes[i];
            g.addNode(new_node.id);
        }
        for (j in graph.links) {
            new_edge = graph.links[j];
            g.addLink(new_edge.source, new_edge.target, 
                new_edge.weight);
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
            id = '' + message.id;
            g.addNode(message.id);
        }
        if(message.command == "\"AddEdge\""){
            source =  '' + message.source;
            target =  '' + message.target;
            g.addLink(source, target, '10');
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


