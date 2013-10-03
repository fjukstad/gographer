var nodes = [];
var edges = [];
var graph = []; 


function Graph(el){

    

}
$(loadCy = function(){
    options = {
        layout: {
            name: 'random', 
            gravity: true,
            liveUpdate: true,
            maxSimulationtime: 100000,
        },
        showOverlay: false,
        minZoom: 0.5,
        maxZoom: 2,
        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(id)',
                'text-valign': 'center',
                'background-color': 'steelblue',
                'text-outline-width': 0,
                'text-outline-color': '#888',
                'text-opacity': 0,
                'height': 20,
                'width': 20, 
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle'
        }),
        elements : {
            
            nodes: [
                { data: {id: 'h', name: 'Hello', weight: 10, height: 40 } },
                { data: {id: 'w', name: 'World', weight: 30, height: 70} }
            ],
            edges : [
                { data: {source: 'h', target: 'w'} },
                { data: {source: 'w', target: 'w'} }
            ]
        },

        ready: function(){
            cy = this;
            console.log("ready");
            
            // Load data from JSON 
            var url = "ws://"+window.location.hostname+":3999/ws";
            var socket = new WebSocket(url); 
            socket.onmessage = function(m){
                var message = JSON.parse(m.data); 
                if(message.command == "\"InitGraph\""){
                    
                    json = JSON.parse(JSON.parse(message.graph)); 
                    var graph = [];
                    var numAdded = 0; 
                    console.log(json.nodes);
                    
                    for(var i in json.nodes){
                        var n = json.nodes[i]; 
                        var no = {
                            group: 'nodes',
                            data: { 
                                id: ''+ n.id,
                                name: JSON.parse(n.name),
                                weight: 10,
                                height: 10,
                            },
                            position: {
                                x: Math.random() * 100,
                                y: Math.random() * 100
                            }
                        };
                        nodes.push(no);
                    }
                    cy.layout();
                    var cy_nodes = cy.add(nodes); 
                    console.log("added nodes");
                    graph = [];
                    for(var j in json.edges){
                        var e = json.edges[j]; 
                        var ed = {
                            group: "edges",
                            data: {
                                source: ''+e.source,
                                target: ''+e.target,
                                //weight: e.weight,
                            },
                        };
                        console.log(json.edges[j]);
                        cy.add(ed); 
                        //graph.push(ed); 
                    }
                    cy.layout();
                    console.log(graph.length,graph);
                    //var edges = cy.add(graph); 
                    //console.log(edges);
                }
            } 
            
            
        }
    }; 


    $('#cy').cytoscape(options); 
});


    var color = d3.scale.category20();

