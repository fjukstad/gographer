package gographer

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/fjukstad/gowebsocket"
	"golang.org/x/net/websocket"
)

type Graph struct {
	Nodes map[string]*Node `json:"nodes,omitempty"`
	Edges map[string]*Edge `json:"edges,omitempty"`

	wss *gowebsocket.WSServer
	wc  *gowebsocket.Client
}

type Node struct {
	stringIdentifier string
	Id               int          `json:"id,int"`
	Name             string       `json:"name,string"`
	Group            string       `json:"group,string"`
	Size             int          `json:"size,int"`
	Graphics         NodeGraphics `json:"graphics, omitempty"`
}

type Edge struct {
	stringIdentifier string
	Source           int          `json:"source, int"`
	Target           int          `json:"target, int"`
	Id               int          `json:"id, int"`
	Weight           int          `json:"weight, int"`
	Graphics         EdgeGraphics `json:"graphics, omitempty"`
}

/* This is invoked first for all new connections.
 * Output current graph state before giving out updates
 */
func (g *Graph) Handler(conn *websocket.Conn) {
	b, err := json.Marshal(g)
	if err != nil {
		log.Panic("Marshaling went bad: ", err)
	}

	msg := InitGraphMessage{
		Command: "InitGraph",
		Graph:   string(b),
	}

	encoded, err := json.Marshal(msg)
	if err != nil {
		log.Panic("Marshaling went oh so bad: ", err)
	}

	conn.Write(encoded)
}

func New() *Graph {

	port := ":3999"
	return NewGraphAt(port)
}

// The functionality of starting wsserver on specified port
func NewGraphAt(port string) *Graph {
	graph := new(Graph)

	nodes := make(map[string]*Node)
	edges := make(map[string]*Edge)

	wsserver := gowebsocket.New("", port)
	wsserver.SetConnectionHandler(graph)
	wsserver.Start()

	wsclient, err := gowebsocket.NewClient("localhost", port)
	if err != nil {
		/* TODO: Same as above */
	}

	graph.Nodes = nodes
	graph.Edges = edges
	graph.wss = wsserver
	graph.wc = wsclient

	return graph
}

func (g *Graph) ServerInfo() string {
	return g.wss.GetServerInfo()
}

// Node is uniquely identified by id
func (g *Graph) AddNode(id int, name string, group int, size int) {
	var graphics NodeGraphics
	n := &Node{Id: id, Name: name, Group: "group " + strconv.Itoa(group),
		Size: size, Graphics: graphics}

	n.stringIdentifier = fmt.Sprintf("%d", id)

	// Prevents nodes being added multiple times
	if _, alreadyAdded := g.Nodes[n.stringIdentifier]; !alreadyAdded {
		g.Nodes[n.stringIdentifier] = n
		g.BroadcastAddNode(*n)
	}
}

func (g *Graph) RemoveNode(nodeId int) {
	stringIdentifier := fmt.Sprintf("%d", nodeId)
	if node, exists := g.Nodes[stringIdentifier]; exists {
		// TODO: Remove all links associated with node.
		g.BroadcastRemoveNode(*node)
		delete(g.Nodes, stringIdentifier)
	}
}

// Add edge between Source and Target
// Edge is uniquely identified by tuple (source, target, id)
func (g *Graph) AddEdge(from, to, id, weight int) {
	var graphics EdgeGraphics

	e := &Edge{Source: from, Target: to, Id: id, Weight: weight, Graphics: graphics}

	e.stringIdentifier = fmt.Sprintf("%d-%d:%d", from, to, id)
	e.Weight = 1

	if _, exists := g.Edges[e.stringIdentifier]; !exists {
		g.Edges[e.stringIdentifier] = e
		g.BroadcastAddEdge(*e)
	}
}

func (g *Graph) RemoveEdge(from, to, id int) {
	stringIdentifier := fmt.Sprintf("%d-%d:%d", from, to, id)
	if edge, exists := g.Edges[stringIdentifier]; exists {
		g.BroadcastRemoveEdge(*edge)
		delete(g.Edges, stringIdentifier)
	}
}

func (g *Graph) RenameNode(nodeId int, name string) {
	stringIdentifier := fmt.Sprintf("%d", nodeId)
	if node, exists := g.Nodes[stringIdentifier]; exists {
		node.Name = name
		g.BroadcastRenameNode(*node)
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

	// Marshal
	b, err := json.Marshal(g)
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

func (g *Graph) Visualize() {
	gopath := os.Getenv("GOPATH")
	rootServeDir := gopath + "/src/github.com/fjukstad/gographer/root_serve_dir/"
	port := ":8080"
	log.Println("Graph created, go visit at localhost" + port)
	panic(http.ListenAndServe(port, http.FileServer(http.Dir(rootServeDir))))
}
