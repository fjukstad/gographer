var g; 

function graph(el){

    this.addNode= function(id) {
        nodes.push({"id":id}); 
        drawGraph(); 
    }

    this.addLink = function(source,target,value) {
        s = findNode(source);
        t = findNode(target);
        links.push({"source":s, "target":t, "value":value}); 
        drawGraph(); 
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
    console.log("Drawing graph: ", nodes); 

    force.nodes(nodes) 
        .start(); 

    link = link.data(links);
    link.enter().insert("line")
        .attr("class", "link")
        .style("stroke-width", 2); 
    
    console.log(link);
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
                console.log("d:", d); 
                console.log("nodes:", nodes); 
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
    g.addNode('A') 
    g.addNode('B')
    g.addLink('A', 'B', 10); 
}

function updateGraph() {
    name = "node"+Math.random() * 10
    name2 = "node"+Math.random() * 100

    g.addNode(name); 
    g.addNode(name2); 
    
    g.addLink(name, name2, 10); 
    
    console.log("added node: ", name) 

    //drawGraph();
    window.setTimeout(updateGraph, 10000); 
}

$(document).ready(function () {
    createGraph();
    //drawGraph(); 
    window.setTimeout(updateGraph, 1000); 
});


