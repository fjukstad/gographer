$(loadCy = function(){
    options = {
        showOverlay: false,
        minZoom: 0.5,
        maxZoom: 2,
        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'center',
                'color': 'white',
                'text-outline-width': 2,
                'text-outline-color': '#888'
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
        }
    }; 
    $('#cy').cytoscape(options); 
});
