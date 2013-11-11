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
                graphics: n.graphics,
                
            },
            position: {
                x: n.graphics.x,
                y: n.graphics.y
            }
        };

        nodes.push(no);
        cy.add(no); 
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
        //cy.layout(); 
    }

}
$(loadCy = function(){
    options = {
        
        layout: {
            name: 'preset', 
           // gravity: true,
            liveUpdate: true,
            maxSimulationtime: 1000,
        },
        
        
        showOverlay: false,
        minZoom: 0.05,
        maxZoom: 20,
        style: cytoscape.stylesheet()
            .selector('node')
            
            .css({
                'content': 'data(name)',
                'text-valign': 'right',
                'background-color': 'data(graphics.fgcolor)',
                'text-outline-width': 0,
                'text-outline-color': '#ccc',
                'text-opacity': 0.5,
                'text-color': '#ccc',
                'shape': 'data(graphics.shape)',
                'height': 'data(graphics.height)',
                'width': 'data(graphics.width)', 
            })

            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle'
        }),
        elements : {
            
            nodes: [],
            edges : []
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
                    //cy.layout(); 
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


