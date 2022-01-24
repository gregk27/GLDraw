console.log("Hello World!")

class VBO {
    /**
     * Create a new VBO
     * @param {string} name Name of the VBO 
     */
    constructor(name) {
        /** @type string */
        this.name = name;
        /** @type Vertex[] */
        this.verts = [];

        /** @type HTMLButtonElement */
        this.addButton = null;
    }

    /**
     * Build DOM for the VBO
     * @returns {HTMLElement} DOM Element representing the VBO
     */
    buildDOM() {
        let e = document.createElement('div');
        e.classList.add("vbo");
        
        let title = document.createElement("h2");
        title.innerText = this.name;
        e.appendChild(title);

        for(let v of this.verts){
            e.appendChild(v.buildDOM());
        }

        this.addButton = document.createElement('button');
        this.addButton.innerText = "Add Vertex";
        e.appendChild(this.addButton);

        return e;
    }

    /**
     * Add a vertex to the VBO
     * @param {Vertex} v 
     */
    addVertex(v){
        this.verts.push(v);
    }

    /**
     * Get the colour of the next vertex added
     * @returns {string} Hex colour in format #RRGGBB
     */
    getNextColor(){
        if(this.verts.length > 0){
            return this.verts[this.verts.length-1].color;
        } else {
            return "#000000"
        }
    }
}

class Vertex {
    /**
     * Create a new Vertex for a VBO
     * @param {VBO} parent 
     */
    constructor(parent) {
        /** @type {VBO} */
        this.parent = parent;
        /** @type {number} */
        this.x = 0;
        /** @type {number} */
        this.y = 0;
        /** @type {string} */
        this.color = parent.getNextColor();

        /** @type {HTMLInputElement} */
        this.xInput = null;
        /** @type {HTMLInputElement} */
        this.yInput = null;
        /** @type {HTMLInputElement} */
        this.colorPicker = null;
        /** @type {HTMLButtonElement} */
        this.upButton = null;
        /** @type {HTMLButtonElement} */
        this.downButton = null;
    }

    /**
     * Build DOM for the vertex
     * @returns {HTMLElement} DOM Element representing the vertex
     */
    buildDOM(){
        let e = document.createElement('div');
        e.classList.add("vertex");
        {
            let label = document.createElement('label');
            label.innerText = "X: "
            this.xInput = document.createElement('input');
            this.xInput.type = "number";
            this.xInput.size = "3";
            this.xInput.value = this.x;
            label.appendChild(this.xInput);
            e.appendChild(label);
        }
        {
            let label = document.createElement('label');
            label.innerText = "Y: "
            this.yInput = document.createElement('input');
            this.yInput.type = "number";
            this.yInput.size = "3";
            this.yInput.value = this.y;
            label.appendChild(this.yInput);
            e.appendChild(label);
        }
        this.colorPicker = document.createElement('input');
        this.colorPicker.type = "color";
        this.colorPicker.value = this.color;
        e.appendChild(this.colorPicker);

        this.upButton = document.createElement("button");
        this.upButton.innerText = "🠝"
        e.appendChild(this.upButton);
        this.downButton = document.createElement("button");
        this.downButton.innerText = "🠟"
        e.appendChild(this.downButton);

        return e;
    }
}

let vbo = new VBO("VBO 1");
let vert = new Vertex(vbo);
vert.color = "#FF0000"
vbo.addVertex(vert);
let vert2 = new Vertex(vbo);
vbo.addVertex(vert2);
