package gographer

import (
    "encoding/json"
    "log"
)

type AddNodeMessage struct {
    Command string     `json:"command,string"`
    Id		int         `json:"id,int"`
    Name	string      `json:"name,string"`
    Group	string      `json:"group,string"`
    Size	int         `json:"size,int"`
}

type AddEdgeMessage struct  {
    Command string      `json:"command,string"`
    Source	int         `json:"source, int"`
    Target	int         `json:"target, int"`
	Id		int         `json:"id, int"`
	Weight	int         `json:"weight, int"`
}


func (g *Graph) BroadcastAddNode(n Node) {
    msg := AddNodeMessage{
        Command: "AddNode",
        Id: n.Id,
        Name: n.Name,
        Group: n.Group,
        Size: n.Size,
    }
    
    encoded, err := json.Marshal(msg)
    
    if err != nil {
        log.Panic("Marshaling went oh so bad: ", err)
    }

    g.wc.SendBytes(encoded)
    
}


func (g *Graph) BroadcastAddEdge (e Edge) {

    msg := AddEdgeMessage {
        Command: "AddEdge",
        Source: e.Source,
        Target: e.Target,
        Id: e.Id,
        Weight: e.Weight,
    }

    encoded, err := json.Marshal(msg)
    if err != nil {
        log.Panic("Marshaling went bad: ", err)
    }

    g.wc.SendBytes(encoded) 
    
}



