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
        /** @type number */
        this.nextId = 0;

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
        if(this.rootElement != null && this.rootElement.parentElement != null){
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
            let e = this.rootElement.nextElementSibling;
            this.rootElement.parentElement.insertBefore(this.buildDOM(), e);
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

    /**
     * Get the unique ID of the next vertex
     * @returns ID of the next vertex
     */
    getNextId(){
        return `${this.name}::V${this.nextId++}`;
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
        /** @type {string} */
        this.id = parent.getNextId();

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
        /** @type {HTMLButtonElement} */
        this.removeButton = null;
    }

    /**
     * Build DOM for the vertex
     * @returns {HTMLElement} DOM Element representing the vertex
     */
    buildDOM(){
        // Delete the element if it already exists
        if(this.rootElement != null && this.rootElement.parentElement != null){
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
            this.xInput.onchange = () => {
                this.x = this.xInput.value;
            }
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
            this.yInput.onchange = () => {
                this.y = this.yInput.value;
            }
            label.appendChild(this.yInput);
            this.rootElement.appendChild(label);
        }
        this.colorPicker = document.createElement('input');
        this.colorPicker.type = "color";
        this.colorPicker.value = this.color;
        this.colorPicker.onchange = () => {
            this.color = this.colorPicker.value;
        }
        this.rootElement.appendChild(this.colorPicker);

        this.upButton = document.createElement("button");
        this.upButton.innerText = "🠝"
        this.upButton.onclick = () => {
            let idx = this.parent.verts.indexOf(this);
            if(idx == 0) return;
            console.log(this.parent.verts);
            this.parent.verts.splice(idx, 1);
            this.parent.verts.splice(idx-1, 0, this);
            this.parent.updateDOM();
            console.log(this.parent.verts);
        }
        this.rootElement.appendChild(this.upButton);
        this.downButton = document.createElement("button");
        this.downButton.innerText = "🠟"
        this.downButton.onclick = () => {
            let idx = this.parent.verts.indexOf(this);
            if(idx == this.parent.verts.length) return;
            this.parent.verts.splice(idx, 1);
            this.parent.verts.splice(idx+1, 0, this);
            this.parent.updateDOM();
        }
        this.rootElement.appendChild(this.downButton);

        this.removeButton = document.createElement("button");
        this.removeButton.innerText = "×"
        this.removeButton.onclick = () => {
            let idx = this.parent.verts.indexOf(this);
            this.parent.verts.splice(idx, 1);
            this.parent.updateDOM();
        }
        this.rootElement.appendChild(this.removeButton);

        return this.rootElement;
    }
}

/** @type {VBO[]} */
var vbos = [];

function updateVBOs(){
    let e = document.getElementById("inputs");
    while(e.firstChild != null) e.removeChild(e.firstChild);
    console.log(vbos);
    for(let v of vbos){
        e.appendChild(v.buildDOM())
    }
    let button = document.createElement("button");
    button.innerText = "Add VBO"
    button.onclick = () => {
        vbos.push(new VBO("VBO"));
        updateVBOs();
    }
    e.appendChild(button);
}

function redraw(){
    const canvas = document.getElementById("display");
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');

    const width = document.getElementById("display").width;
    const height = document.getElementById("display").height;
    const cx = width/2;
    const cy = height/2;
    const scale = width/15;

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    ctx.lineWidth = scale;
}

window.onload = () => {
    let vbo = new VBO("VBO 1");
    let vert = new Vertex(vbo);
    vert.color = "#FF0000"
    vbo.addVertex(vert);
    let vert2 = new Vertex(vbo);
    vbo.addVertex(vert2);

    vbos.push(vbo);
    updateVBOs();

    redraw()
}
