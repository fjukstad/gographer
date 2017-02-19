package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/fjukstad/gographer"
)

func main() {
	g := gographer.New()

	rand.Seed(time.Now().UTC().UnixNano())
	numNodes := 50
	for i := 0; i < numNodes; i++ {
		id := rand.Intn(numNodes)

		description := "Description for node " + strconv.Itoa(id)
		fgcolor := randomColor()
		bgcolor := randomColor()
		shape := randomShape()
		x := rand.Intn(500)
		y := rand.Intn(500)
		height := 50 // rand.Intn(50)
		width := 50  //rand.Intn(50)

		typ := randomType()
		name := randomName()
		value := randomValue()

		g.AddGraphicNode(id, "node "+strconv.Itoa(id), id, 1, description,
			fgcolor, bgcolor, shape, x, y, height, width)
		g.AddGraphicEdge(id, rand.Intn(numNodes), id, 1, typ, name, value)
	}

	gopath := os.Getenv("GOPATH")
	rootServeDir := gopath + "/src/github.com/fjukstad/gographer/root_serve_dir/"

	log.Println("Graph created, go visit at localhost:8080")

	panic(http.ListenAndServe(":8080", http.FileServer(http.Dir(rootServeDir))))
}

func randomColor() string {

	rand.Seed(time.Now().UTC().UnixNano())
	a := rand.Intn(255)
	b := rand.Intn(255)
	c := rand.Intn(255)

	return fmt.Sprintf("#%02x%02x%02x", a, b, c)

}

func randomShape() string {
	rand.Seed(time.Now().UTC().UnixNano())
	a := rand.Intn(3)
	switch a {
	case 0:
		return "ellipse"
	case 1:
		return "rectangle"
	case 2:
		return "triangle"
	default:
		return "hexagon"
	}
}

func randomName() string {
	rand.Seed(time.Now().UTC().UnixNano())
	a := rand.Intn(3)
	switch a {
	case 0:
		return "inhibition"
	case 1:
		return "phosphorylation"
	case 2:
		return "activation"
	default:
		return "missing interaction"
	}
}

func randomValue() string {
	rand.Seed(time.Now().UTC().UnixNano())
	a := rand.Intn(3)
	switch a {
	case 0:
		return "--|"
	case 1:
		return "-->"
	case 2:
		return "..>"
	default:
		return "-/-"
	}
}

func randomType() string {
	rand.Seed(time.Now().UTC().UnixNano())
	a := rand.Intn(3)
	switch a {
	case 0:
		return "PCrel"
	case 1:
		return "PPrel"
	case 2:
		return "GErel"
	default:
		return "rel"
	}
}
