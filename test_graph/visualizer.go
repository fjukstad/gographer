package main

import (
	"net/http"
	"github.com/fjukstad/gographer"
	"math/rand"
	"time"
	"strconv"
	"os"
)


func main(){
    g := gographer.New()

    rand.Seed(time.Now().UTC().UnixNano())
    numNodes := 50
    for i := 0; i < numNodes; i++ {
        id := rand.Intn(numNodes)
        g.AddNode(id, "node "+strconv.Itoa(id), id, 1)
        g.AddEdge(id,rand.Intn(numNodes), 1)

    }

	gopath := os.Getenv( "GOPATH" );
	rootServeDir := gopath + "/src/github.com/fjukstad/gographer/root_serve_dir/"
	g.DumpJSON( rootServeDir + "graph.json")
	panic(http.ListenAndServe(":8080", http.FileServer(http.Dir( rootServeDir ))))
}


