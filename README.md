# gographer

Simple graph package for go.

# Wtf

- _gographer.go_ contains source code to get started with a graph library
- _visualizer.go_ contains source code to host the visualizations
- _index.html_ contains the visualization code itself
- _graph.json_ contains the output from gographer.go (graph).


# Run the rest visualization:
    go run test_graph/visualization.go

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


Open localhost:8080 in a webbrowser to se the graph.

Modify the d3js implementation and visualization to your preferences.


