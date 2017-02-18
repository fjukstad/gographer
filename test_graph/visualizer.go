package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/fjukstad/gographer"
)

// Make random changes to graph
func makeRandomChanges(g *gographer.Graph) {
	nodesToBeRemoved := 2
	nodesToBeAdded := 5

	for {
		numNodes := g.GetNumberOfNodes()

		// Remove some nodes
		for i := 0; i < nodesToBeRemoved; i++ {
			id := rand.Intn(numNodes)
			g.RemoveNode(id)
		}

		// Add some more nodes and edges
		for i := 0; i < nodesToBeAdded; i++ {
			id := rand.Intn(numNodes)
			g.AddNode(id, "node "+strconv.Itoa(id), id, 1)
			g.AddEdge(id, rand.Intn(numNodes), id, 1)
		}

		time.Sleep(2000 * time.Millisecond)
	}
}

func main() {
	g := gographer.New()

	rand.Seed(time.Now().UTC().UnixNano())
	numNodes := 50
	for i := 0; i < numNodes; i++ {
		id := rand.Intn(numNodes)
		g.AddNode(id, "node "+strconv.Itoa(id), id, 1)
		g.AddEdge(id, rand.Intn(numNodes), id, 1)
	}

	gopath := os.Getenv("GOPATH")
	rootServeDir := gopath + "/src/github.com/fjukstad/gographer/root_serve_dir/"

	go makeRandomChanges(g)

	log.Println("Graph created, go visit at localhost:8080")

	panic(http.ListenAndServe(":8080", http.FileServer(http.Dir(rootServeDir))))
}
