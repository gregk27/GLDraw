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

        /** @type {HTMLElement} */
        this.rootElement = null;
        /** @type {HTMLButtonElement} */
        this.addButton = null;
    }

    /**
     * Build DOM for the VBO
     * @returns {HTMLElement} DOM Element representing the VBO
     */
    buildDOM() {
        // Delete the element if it already exists
        if(this.rootElement != null){
            this.rootElement.parentElement.removeChild(this.rootElement);
        }
        
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("vbo");
        
        let title = document.createElement("h2");
        title.innerText = this.name;
        this.rootElement.appendChild(title);

        for(let v of this.verts){
            this.rootElement.appendChild(v.buildDOM());
        }

        this.addButton = document.createElement('button');
        this.addButton.innerText = "Add Vertex";
        this.addButton.onclick = () => {
            this.addVertex(new Vertex(this));
        }
        this.rootElement.appendChild(this.addButton);

        return this.rootElement;
    }

    /**
     * Update the VBO's DOM in-place
     */
    updateDOM() {
        if(this.rootElement != null){
            this.rootElement.parentElement.appendChild(this.buildDOM());
        }
    }

    /**
     * Add a vertex to the VBO
     * @param {Vertex} v 
     */
    addVertex(v){
        this.verts.push(v);
        this.updateDOM();
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

        /** @type {HTMLElement} */
        this.rootElement
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
        // Delete the element if it already exists
        if(this.rootElement != null){
            this.rootElement.parentElement.removeChild(this.rootElement);
        }

        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("vertex");
        {
            let label = document.createElement('label');
            label.innerText = "X: "
            this.xInput = document.createElement('input');
            this.xInput.type = "number";
            this.xInput.size = "3";
            this.xInput.value = this.x;
            label.appendChild(this.xInput);
            this.rootElement.appendChild(label);
        }
        {
            let label = document.createElement('label');
            label.innerText = "Y: "
            this.yInput = document.createElement('input');
            this.yInput.type = "number";
            this.yInput.size = "3";
            this.yInput.value = this.y;
            label.appendChild(this.yInput);
            this.rootElement.appendChild(label);
        }
        this.colorPicker = document.createElement('input');
        this.colorPicker.type = "color";
        this.colorPicker.value = this.color;
        this.rootElement.appendChild(this.colorPicker);

        this.upButton = document.createElement("button");
        this.upButton.innerText = "🠝"
        this.rootElement.appendChild(this.upButton);
        this.downButton = document.createElement("button");
        this.downButton.innerText = "🠟"
        this.rootElement.appendChild(this.downButton);

        return this.rootElement;
    }
}

let vbo = new VBO("VBO 1");
let vert = new Vertex(vbo);
vert.color = "#FF0000"
vbo.addVertex(vert);
let vert2 = new Vertex(vbo);
vbo.addVertex(vert2);
