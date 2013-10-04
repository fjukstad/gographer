var nodes = [];
var edges = [];
var graph;


function Graph(cy){
    this.addNode = function(n){
        
        if(typeof findNode(n.id) != 'undefined') {
            console.log("attempted to add node (",n.id,") which exists.."); 
            return
        }

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
    };

    this.addEdge = function(e){
        var s = findNode(e.source); 
        var t = findNode(e.target); 
        
        if(typeof s == 'undefined' || typeof t == 'undefined'){
            console.log("Attempted to add a faulty edge"); 
            return
        }

        var ed = {
            group: "edges",
            data: {
                source: ''+e.source,
                target: ''+e.target,
                //weight: e.weight,
            },
        }; 

        edges.push(ed); 
        cy.add(ed); 

    }

    var findNode = function (id) {
        for (var i in nodes) {
            if (nodes[i]["data"]["id"] === ''+id) {
                return nodes[i];
            }
        };
    };


    
    var update = function() {
        cy.layout(); 
    }

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
                'content': 'data(name)',
                'text-valign': 'right',
                'background-color': 'steelblue',
                'text-outline-width': 0,
                'text-outline-color': '#ccc',
                'text-opacity': 0.5,
                'text-color': '#ccc',
                'height': 20,
                'width': 20, 
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle'
        }),
        elements : {
            
            nodes: [],
            /*
                { data: {id: 'h', name: 'Hello', weight: 10, height: 40 } },
                { data: {id: 'w', name: 'World', weight: 30, height: 70} }
            ],
            */
            edges : [
                { data: {source: 'h', target: 'w'} },
                { data: {source: 'w', target: 'w'} }
            ]
        },

        ready: function(){
            cy = this;
            console.log("ready");
            graph = new Graph(cy); 
            
            // Load data from JSON 
            var url = "ws://"+window.location.hostname+":3999/ws";
            var socket = new WebSocket(url); 
            socket.onmessage = function(m){
                var message = JSON.parse(m.data); 
                if(message.command == "\"InitGraph\""){
                    
                    json = JSON.parse(JSON.parse(message.graph)); 
                    var numAdded = 0; 
                    console.log(json.nodes);
                    
                    for(var i in json.nodes){
                        var n = json.nodes[i]; 
                        graph.addNode(n); 
                    }
                    var cy_nodes = cy.add(nodes); 
                    for(var j in json.edges){
                        var e = json.edges[j]; 
                        graph.addEdge(e); 
                                                //graph.push(ed); 
                    }
                    cy.layout();
                }

                if(message.command == "\"AddNode\""){
                    graph.addNode(message); 
                    cy.layout();
                }
            } 
            
            
        }
    }; 


    $('#cy').cytoscape(options); 
});


    var color = d3.scale.category20();

