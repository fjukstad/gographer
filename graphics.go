/*
   Functinality for taking control of layout of graph
*/

package gographer

import (
	"fmt"
	"strconv"
)

type NodeGraphics struct {
	Name    string `json:"name, string"`
	FGColor string `json:"fgcolor, string"`
	BGColor string `json:"bgcolor, string"`
	Shape   string `json:"shape, string"`
	X       int    `json:"x, int"`
	Y       int    `json:"y, int"`
	Height  int    `json:"height, int"`
	Width   int    `json:"width, int"`
}

type EdgeGraphics struct {
	Type  string `json:"type, string"`
	Name  string `json:"name, string"`
	Value string `json:"value, string"`
}

func (g *Graph) AddGraphicNode(id int, name string, group int, size int,
	description string, fgcolor string, bgcolor string, shape string, x int,
	y int, height int, width int) {

	graphics := NodeGraphics{description, fgcolor, bgcolor, shape, x, y, height, width}

	// TODO: Maybe clean up the below and write this and AddNode as one func

	n := &Node{Id: id, Name: name, Group: "group " + strconv.Itoa(group),
		Size: size, Graphics: graphics}

	n.stringIdentifier = fmt.Sprintf("%d", id)

	// Prevents nodes being added multiple times
	if _, alreadyAdded := g.Nodes[n.stringIdentifier]; !alreadyAdded {
		g.Nodes[n.stringIdentifier] = n
		g.BroadcastAddNode(*n)
	}
}

func (g *Graph) AddGraphicEdge(from, to, id, weight int, typ, name, value string) {

	graphics := EdgeGraphics{typ, name, value}

	e := &Edge{Source: from, Target: to, Id: id, Weight: weight, Graphics: graphics}

	e.stringIdentifier = fmt.Sprintf("%d-%d:%d", from, to, id)
	e.Weight = 1

	if _, exists := g.Edges[e.stringIdentifier]; !exists {
		g.Edges[e.stringIdentifier] = e
		g.BroadcastAddEdge(*e)
	}
}
