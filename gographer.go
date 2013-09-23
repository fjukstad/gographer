package gographer

import (
    "log"
    "encoding/json"
    "os"
    "strconv"
	"fmt"
)

type Graph struct {
    internalId map[int] int     // These two are used for the mappings internal
    externalId map[int] int     // id -> external id and back
    Nodes [] Node `json:"nodes,omitempty"`
    Edges [] Edge   `json:"links,omitempty"`
}

type Node struct {
    Id int          `json:"id,int"`
    Name string     `json:"name,string"`
    Group string    `json:"group,string"`
    Size int        `json:"size,int"`
}

type Edge struct {
    Source int  `json:"source, int"`
    Target int  `json:"target, int"`
    Value int   `json:value, int"`
}

func New() *Graph{

    internalmap := make(map[int] int)
    externalmap := make(map[int] int)

    nodes := make([] Node, 0) 
    edges := make([] Edge, 0)
    
    graph := Graph {internalmap, externalmap, nodes,edges} 
    
    return &graph
}


func (g *Graph) AddNode (id int, name string, group int, size int) {
    n := Node{id,name,"group "+strconv.Itoa(group),size}
    // Prevents nodes being added multiple times
    _, alreadyAdded := g.internalId[n.Id]
    if !alreadyAdded {
        g.internalId[n.Id] = g.GetNumberOfNodes() 
        g.externalId[g.GetNumberOfNodes()] = n.Id
        n.Id = g.GetNumberOfNodes()
        g.Nodes = append(g.Nodes, n) 
        return 
    }

    // Could return some error, but what the hell

}
func (g *Graph) RemoveNode (nodeId int){

    // First check that node is actually there
    _, nodePresent := g.internalId[nodeId]
    if nodePresent{
        id := g.internalId[nodeId]
        g.Nodes[id].Id = -1
    }

}

func(g *Graph) GetNumberOfNodes() (numberOfNodes int) {
    
    numberOfNodes = 0

    for i := range g.Nodes{
        if g.Nodes[i].Id != -1 {
            numberOfNodes += 1
        }
    }
    return numberOfNodes
}

// Write graph to json file
func (g *Graph) DumpJSON(filename string){
    
    // Marshal
    b, err := json.Marshal(g)
    if err != nil{
        log.Panic("Marshaling of graph gone wrong")
    }

	fmt.Printf( "Filename: %s", filename );
    // Create file
    file, err := os.Create(filename) 
    if err != nil{
        log.Panic("Could not create json file for graph")
    }

    // Write to file
    _, err = file.Write(b)
    if err != nil{
        log.Panic("Could not write json to file")
    }
    return 

}

func (g *Graph) AddEdge(from, to, value int) {
    e := Edge{from,to,value}

    sourceId := g.internalId[e.Source]
    targetId := g.internalId[e.Target]

    e.Source = sourceId
    e.Target = targetId

    g.Edges = append(g.Edges, e) 
}



func (g *Graph) RemoveEdge(from,to int) {
    
    sourceId := g.internalId[from]
    targetId := g.internalId[to]


    for i := range g.Edges {
        log.Print(g.Edges[i])
        e := g.Edges[i]
        if((e.Source == sourceId) && (e.Target == targetId)){
            g.Edges[i] = Edge{-1,-1,-1}
        }
    }

}


