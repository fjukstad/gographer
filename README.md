# gographer

Simple graph package for go. Uses [d3js](https://github.com/mbostock/d3) for visualization and websockets for communication. 


# Run the test visualization

    go run test_graph/visualization.go
    
and visit [localhost:8080](http://localhost:8080) in your browser 

# Using it
Import it:

    import "github.com/fjukstad/gographer"

Using it:

    graph = gographer.New();
    // (ID, NodeStringID, GroupName, Size)
    graph.AddNode( 1, "NodeStringID", "GroupName", 1 )
    graph.AddNode( 2, "NodeStringID", "GroupName", 1 )

    // (Source, Target, EdgeID, weight )
    grap.AddEdge( 1, 2, 0, 1 )
    graph.AddEdge( 2, 1, 100, 15 )

    graph.DumpJSON( "graph.json" )
    http.ListenAndServe( ":8080", http.FileServer( http.Dir( "." ) ) )


Open [localhost:8080](http://localhost:8080) in a webbrowser to view the graph.
Have a look at [localhost:8080/canvas.html](http://localhost:8080/canvas.html)
for the visualization using the HTML canvas element for rendering.
Visit [localhost:8080/cytoscape.html](http://localhost:8080/cytoscape.html) for
a visualization using the
[cytoscape.js](http://cytoscape.github.io/cytoscape.js) library. 

Modify the d3js implementation and visualization to your preferences.


# Files

- _gographer.go_ contains source code to get started with a graph library
- _visualizer.go_ contains source code to host the visualizations
- _root_serve_dir/index.html_ contains the empty shell for the visualization
- _root_serve_dir/js/_ contains source code for the visualization
- _root_serve_dir/css/_ contains css files for visualization
- _graph.json_ contains the output from gographer.go (graph).
