package gographer

import (
	"encoding/json"
	"log"
)

type InitGraphMessage struct {
	Command string `json:"command,string"`
	Graph   string `json:"graph,string"`
}

type AddNodeMessage struct {
	Command string `json:"command,string"`
	Id      int    `json:"id,int"`
	Name    string `json:"name,string"`
	Group   string `json:"group,string"`
	Size    int    `json:"size,int"`
}

type AddEdgeMessage struct {
	Command string `json:"command,string"`
	Source  int    `json:"source,int"`
	Target  int    `json:"target,int"`
	Id      int    `json:"id,int"`
	Weight  int    `json:"weight,int"`
}

type RemoveNodeMessage struct {
	Command string `json:"command,string"`
	Id      int    `json:"id,int"`
}

type RemoveEdgeMessage struct {
	Command string `json:"command,string"`
	Source  int    `json:"source,int"`
	Target  int    `json:"target,int"`
	Id      int    `json:"id,int"`
}

type SetNodeNameMessage struct {
	Command string `json:"command,string"`
	Id      int    `json:"id,int"`
	Name    string `json:"name,string"`
}

func (g *Graph) BroadcastAddNode(n Node) {
	msg := AddNodeMessage{
		Command: "AddNode",
		Id:      n.Id,
		Name:    n.Name,
		Group:   n.Group,
		Size:    n.Size,
	}

	encoded, err := json.Marshal(msg)

	if err != nil {
		log.Panic("Marshaling went oh so bad: ", err)
	}

	g.wc.SendBytes(encoded)

}

func (g *Graph) BroadcastAddEdge(e Edge) {

	msg := AddEdgeMessage{
		Command: "AddEdge",
		Source:  e.Source,
		Target:  e.Target,
		Id:      e.Id,
		Weight:  e.Weight,
	}

	encoded, err := json.Marshal(msg)
	if err != nil {
		log.Panic("Marshaling went bad: ", err)
	}

	g.wc.SendBytes(encoded)
}

func (g *Graph) BroadcastRemoveNode(n Node) {
	msg := RemoveNodeMessage{
		Command: "RemoveNode",
		Id:      n.Id,
	}

	encoded, err := json.Marshal(msg)
	if err != nil {
		log.Panic("Marshaling of BroadcastRemoveNode failed, err: ", err)
	}

	g.wc.SendBytes(encoded)
}

func (g *Graph) BroadcastRemoveEdge(e Edge) {
	msg := RemoveEdgeMessage{
		Command: "RemoveEdge",
		Source:  e.Source,
		Target:  e.Target,
		Id:      e.Id,
	}

	encoded, err := json.Marshal(msg)
	if err != nil {
		log.Panic("Marshaling of BoradcastRemoveEdge failed, err: ", err)
	}

	g.wc.SendBytes(encoded)
}

func (g *Graph) BroadcastRenameNode(n Node) {
	msg := SetNodeNameMessage{
		Command: "SetNodeName",
		Id:      n.Id,
		Name:    n.Name,
	}

	encoded, err := json.Marshal(msg)

	if err != nil {
		log.Panic("Marshaling went oh so bad: ", err)
	}

	g.wc.SendBytes(encoded)
}
