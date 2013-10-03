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
                'color': ,
                'background-color': 'steelblue',
                'text-outline-width': 0,
                'text-outline-color': '#888',
                'text-opacity': 0,
                'height': 10,
                'width': 10, 
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
            numNodes = 200;
            for (i = 0; i < numNodes; i++){
                var first = Math.round(Math.random() * 200);
                var second = Math.round(Math.random() * 200);
                var third = Math.round(Math.random() * 200);
                console.log("new from:",first,"to",second); 

                var eles = cy.add([
                  { group: "nodes", data: { id: "n"+first }, position: { x: first, y: second } },
                  { group: "nodes", data: { id: "n"+second }, position: { x: second, y: first } },
                  { group: "edges", data: { source: "n"+first, target: "n"+second } }
                ]);

            }   
            cy.layout();
            
            
        }
    }; 


    $('#cy').cytoscape(options); 
});


    var color = d3.scale.category20();

