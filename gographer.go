package gographer

import (
	"encoding/json"
	"fmt"
	"github.com/fjukstad/gowebsocket"
	"log"
	"os"
	"strconv"
)

type Graph struct {
	Nodes map[string]*Node `json:"nodes,omitempty"`
	Edges map[string]*Edge `json:"links,omitempty"`

	wss *gowebsocket.WSServer
	wc  *gowebsocket.Client
}

type Node struct {
	stringIdentifier string
	Id               int    `json:"id,int"`
	Name             string `json:"name,string"`
	Group            string `json:"group,string"`
	Size             int    `json:"size,int"`
}

type Edge struct {
	stringIdentifier string
	Source           int `json:"source, int"`
	Target           int `json:"target, int"`
	Id               int `json:"id, int"`
	Weight           int `json:"weight, int"`
}

func New() *Graph {

	nodes := make(map[string]*Node)
	edges := make(map[string]*Edge)

	ip := "localhost"
	port := ":3999"

	wsserver := gowebsocket.New(ip, port)
	wsserver.Start()

	wsclient, err := gowebsocket.NewClient(ip, port)
	if err != nil {
		/* TODO: Notify that websockets are disabled */
	}

	graph := Graph{Nodes: nodes, Edges: edges, wss: wsserver, wc: wsclient}

	return &graph
}

// Node is uniquely identified by id
func (g *Graph) AddNode(id int, name string, group int, size int) {

	n := &Node{Id: id, Name: name, Group: "group " + strconv.Itoa(group),
		Size: size}

	n.stringIdentifier = fmt.Sprintf("%d", id)

	// Prevents nodes being added multiple times
	if _, alreadyAdded := g.Nodes[n.stringIdentifier]; !alreadyAdded {
		g.Nodes[n.stringIdentifier] = n
		g.BroadcastAddNode(*n)
	}
}
func (g *Graph) RemoveNode(nodeId int) {
	stringIdentifier := fmt.Sprintf("%d", nodeId)
	if _, exists := g.Nodes[stringIdentifier]; exists {
		// TODO: Remove all links associated with node.
		delete(g.Nodes, stringIdentifier)
	}
}

// Add edge between Source and Target
// Edge is uniquely identified by tuple (source, target, id)
func (g *Graph) AddEdge(from, to, id, weight int) {
	e := &Edge{Source: from, Target: to, Id: id, Weight: weight}
	e.stringIdentifier = fmt.Sprintf("%d-%d:%d", from, to, id)
	e.Weight = 1

	if _, exists := g.Edges[e.stringIdentifier]; !exists {
		g.Edges[e.stringIdentifier] = e
		g.BroadcastAddEdge(*e)
	}
}

func (g *Graph) RemoveEdge(from, to, id int) {

	stringIdentifier := fmt.Sprintf("%d-%d:%d", from, to, id)
	if _, exists := g.Edges[stringIdentifier]; exists {
		delete(g.Edges, stringIdentifier)
	}
}

func (g *Graph) GetNumberOfNodes() (numberOfNodes int) {

	return len(g.Nodes)
}

type WriteToJSON struct {
	Nodes []*Node `json:"nodes,omitempty"`
	Edges []*Edge `json:"links,omitempty"`
}

// Write graph to json file
func (g *Graph) DumpJSON(filename string) {

	// Build the JSON datastructure to be compatible with d3js
	var writer WriteToJSON
	var jsonIndex int = 0
	nodeMapping := make(map[int]int)
	for _, value := range g.Nodes {
		var jsonNode Node
		nodeMapping[value.Id] = jsonIndex
		jsonNode = *value
		jsonNode.Id = jsonIndex

		jsonIndex++
		writer.Nodes = append(writer.Nodes, &jsonNode)
	}
	for _, value := range g.Edges {

		var jsonEdge Edge
		jsonEdge = *value
		if _, exists := nodeMapping[value.Source]; !exists {
			continue
		}
		jsonEdge.Source = nodeMapping[value.Source]
		if _, exists := nodeMapping[value.Target]; !exists {
			continue
		}
		jsonEdge.Target = nodeMapping[value.Target]

		writer.Edges = append(writer.Edges, &jsonEdge)
	}

	// Marshal
	b, err := json.Marshal(writer)
	if err != nil {
		log.Panic("Marshaling of graph gone wrong")
	}

	// Create file
	file, err := os.Create(filename)
	if err != nil {
		log.Panic("Could not create json file for graph")
	}

	// Write to file
	_, err = file.Write(b)
	if err != nil {
		log.Panic("Could not write json to file")
	}
	return

}
