console.log("Hello World!")

class DrawMode {
    static POINTS = "Points";
    
    static LINES = "Lines";
    static LINE_STRIP = "Line Strip";
    static LINE_LOOP = "Line Loop";
    
    static TRIANGLES = "Triangles";
    static TRIANGLE_STRIP = "Triangle Strip";
    static TRIANGLE_FAN = "Triangle Fan";

    static modes = [this.POINTS, this.LINES, this.LINE_STRIP, this.LINE_LOOP, this.TRIANGLES, this.TRIANGLE_STRIP, this.TRIANGLE_FAN]
}

class VBO {
    /**
     * Create a new VBO
     * @param {string} name Name of the VBO 
     */
    constructor(name) {
        /** @type string */
        this.name = name;
        /** @type string */
        this.drawMode = DrawMode.POINTS;
        /** @type Vertex[] */
        this.verts = [];
        /** @type number */
        this.nextId = 0;

        /** @type {HTMLElement} */
        this.rootElement = null;
        /** @type {HTMLInputElement} */
        this.drawInput = null;
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

        this.drawInput = document.createElement("select");
        for(let m of DrawMode.modes){
            let opt = document.createElement("option");
            opt.value = m;
            opt.text = m;
            if(m == this.drawMode) opt.selected = true;
            this.drawInput.appendChild(opt);
        }
        this.drawInput.onchange = () => {
            this.drawMode = this.drawInput.value;
            redraw();
        }
        this.rootElement.appendChild(this.drawInput);

        for(let v of this.verts){
            this.rootElement.appendChild(v.buildDOM());
        }

        this.addButton = document.createElement('button');
        this.addButton.innerText = "Add Vertex";
        this.addButton.onclick = () => {
            this.addVertex(new Vertex(this));
            redraw();
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
                redraw()
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
                redraw()
            }
            label.appendChild(this.yInput);
            this.rootElement.appendChild(label);
        }
        this.colorPicker = document.createElement('input');
        this.colorPicker.type = "color";
        this.colorPicker.value = this.color;
        this.colorPicker.onchange = () => {
            this.color = this.colorPicker.value;
            redraw()
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
            redraw()
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
            redraw()
        }
        this.rootElement.appendChild(this.downButton);

        this.removeButton = document.createElement("button");
        this.removeButton.innerText = "×"
        this.removeButton.onclick = () => {
            let idx = this.parent.verts.indexOf(this);
            this.parent.verts.splice(idx, 1);
            this.parent.updateDOM();
            redraw()
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
    const scale = width/20;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    ctx.lineWidth = scale/2;
    for(let vbo of vbos){
        switch(vbo.drawMode){
            case DrawMode.POINTS:
                drawPoints(vbo);
                break;
            case DrawMode.LINES:
                drawLines(vbo);
                break;
            case DrawMode.LINE_STRIP:
                drawLineStrip(vbo);
                break;
            case DrawMode.LINE_LOOP:
                drawLineLoop(vbo);
                break;
            case DrawMode.TRIANGLES:
                drawTriangles(vbo);
                break;
            case DrawMode.TRIANGLE_STRIP:
                drawTriangleStrip(vbo);
                break;
            case DrawMode.TRIANGLE_FAN:
                drawTriangleFan(vbo);
                break;
        }
    }

    function transformPoint(x, y){
        return [x*scale + cx, y*-scale + cy]
    }

    /**
     * Draw VBO using GL_POINTS strategy
     * @param {VBO} vbo 
     */
    function drawPoints(vbo){
        for(let vert of vbo.verts){
            ctx.fillStyle = vert.color;
            ctx.fillRect(vert.x*scale + cx - ctx.lineWidth/2, vert.y*-scale + cy - ctx.lineWidth/2, ctx.lineWidth, ctx.lineWidth);
        }
    }
    /**
     * Draw VBO using GL_LINES strategy
     * @param {VBO} vbo 
     */
    function drawLines(vbo) {
        for(let i=0; i+1<vbo.verts.length; i+=2){
            ctx.beginPath();
            ctx.strokeStyle = vbo.verts[i].color;
            ctx.moveTo(...transformPoint(vbo.verts[i].x, vbo.verts[i].y));
            ctx.lineTo(...transformPoint(vbo.verts[i+1].x, vbo.verts[i+1].y));
            ctx.stroke();
        }
    }
    /**
     * Draw VBO using GL_LINE_STRIP strategy
     * @param {VBO} vbo 
     */
    function drawLineStrip(vbo) {
        ctx.beginPath();
        ctx.moveTo(...transformPoint(vbo.verts[0].x, vbo.verts[0].y));
        for(let vert of vbo.verts){
            ctx.strokeStyle = vert.color;
            ctx.lineTo(...transformPoint(vert.x, vert.y));
        }
        ctx.stroke();
    }
    /**
     * Draw VBO using GL_LINE_LOOP strategy
     * @param {VBO} vbo 
     */
    function drawLineLoop(vbo) {
        ctx.beginPath();
        ctx.moveTo(...transformPoint(vbo.verts[0].x, vbo.verts[0].y));
        for(let vert of vbo.verts){
            ctx.strokeStyle = vert.color;
            ctx.lineTo(...transformPoint(vert.x, vert.y));
        }
        ctx.strokeStyle = vbo.verts[0].color;
        ctx.lineTo(...transformPoint(vbo.verts[0].x, vbo.verts[0].y));
        ctx.stroke();
    }
    /**
     * Draw VBO using GL_TRIANGLES strategy
     * @param {VBO} vbo 
     */
    function drawTriangles(vbo) {
        for(let i=0; i+2<vbo.verts.length; i+=3){
            ctx.beginPath();
            ctx.strokeStyle = vbo.verts[i].color;
            ctx.fillStyle = vbo.verts[i].color;
            ctx.moveTo(...transformPoint(vbo.verts[i].x, vbo.verts[i].y));
            ctx.lineTo(...transformPoint(vbo.verts[i+1].x, vbo.verts[i+1].y));
            ctx.lineTo(...transformPoint(vbo.verts[i+2].x, vbo.verts[i+2].y));
            ctx.closePath();
            ctx.fill()
        }
    }
    /**
     * Draw VBO using GL_TRIANGLE_STRIP strategy
     * @param {VBO} vbo 
     */
    function drawTriangleStrip(vbo) {
        for(let i=0; i+2<vbo.verts.length; i++){
            ctx.beginPath();
            ctx.strokeStyle = vbo.verts[i].color;
            ctx.fillStyle = vbo.verts[i].color;
            ctx.moveTo(...transformPoint(vbo.verts[i].x, vbo.verts[i].y));
            ctx.lineTo(...transformPoint(vbo.verts[i+1].x, vbo.verts[i+1].y));
            ctx.lineTo(...transformPoint(vbo.verts[i+2].x, vbo.verts[i+2].y));
            ctx.closePath();
            ctx.fill()
        }
    }
    /**
     * Draw VBO using GL_TRIANGLE_FAN strategy
     * @param {VBO} vbo 
     */
    function drawTriangleFan(vbo) {
        for(let i=0; i+1<vbo.verts.length; i++){
            ctx.beginPath();
            ctx.strokeStyle = vbo.verts[i].color;
            ctx.fillStyle = vbo.verts[i].color;
            ctx.moveTo(...transformPoint(vbo.verts[0].x, vbo.verts[0].y));
            ctx.lineTo(...transformPoint(vbo.verts[i].x, vbo.verts[i].y));
            ctx.lineTo(...transformPoint(vbo.verts[i+1].x, vbo.verts[i+1].y));
            ctx.closePath();
            ctx.fill()
        }
    }
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
