
/* 
    Functinality for taking control of layout of graph
*/ 

package gographer 

type NodeGraphics struct {
    Name        string `json:"name, string"`
    FGColor     string `json:"fgcolor, string"`
    BGColor     string `json:"bgcolor, string"`
    Shape       string `json:"shape, string"`
    X           int    `json:"x, int"`
    Y           int    `json:"y, int"`
    Height      int    `json:"height, int"`
    Width       int    `json:"widht, int"`
}

type EdgeGraphics struct {
    Type    string `json:"type, string"`
    Name    string `json:"name, string"`
    Value   string `json:"value, string"`
}

