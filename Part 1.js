let canvas;
let gl;
let program;
let camera;
let events;
let worldMatrixLocation;
let obj = [];

let cameraPos = [0, 1, 3];
let cameraDir = [0, -3, -15];

let ambientLoc;
let diffuseLoc;
let specularLoc;

let colors = {
	gold: vec4(1, 0.843, 0, 1),
	indigo: vec4(0.294, 0, 0.51, 1),
	violet: vec4(0.933, 0.51, 0.933, 1),
	white: vec4(1, 1, 1, 1),
	red: vec4(1, 0, 0, 1),
	green: vec4(0, 1, 0, 1),
	blue: vec4(0, 0, 1, 1),
	yellow: vec4(1, 1, 0, 1),
	cyan: vec4(0, 1, 1, 1),
	magenta: vec4(1, 0, 1, 1),
	orange: vec4(1, 0.647, 0, 1),
	brown: vec4(0.647, 0.165, 0.165, 1),
	pink: vec4(1, 0.753, 0.796, 1),
	gray: vec4(0.502, 0.502, 0.502, 1)};
let index = 0;

let isColorChangePaused = false;
let textLoc;

window.onload = function init() {

	textLoc = document.getElementById("colorText");
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	gl.viewport(0, 0, canvas.width, canvas.height);
	//gl.clearColor(0, 0.5, 0.5, 0.5);
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);

	program = initShaders(gl, "shaders/PhongShader.vs", "shaders/PhongShader.fs");
	gl.useProgram(program);

	// Associate uniform shader variable with our matrix
	worldMatrixLocation = gl.getUniformLocation(program, "uWorldMatrix");
	//find the light locations
	ambientLoc = gl.getUniformLocation(program, "uLightAmbient");
	diffuseLoc = gl.getUniformLocation(program, "uLightDiffuse");
	specularLoc = gl.getUniformLocation(program, "uLightSpecular");

	//Camera
	camera = new Camera(cameraPos, cameraDir, [0, 1, 0], 178, -22);

	//Events
	events = new Events();
	events.init();

	//Objects
	obj.push(new MyObject("meshes/LightingScene.obj", "textures/brick_texture1.tga", 6, translate(0, 0, 0), rotate(0, [1, 0, 0])));

	//Render
	//Set Colour of the lights
	gl.uniform4fv(ambientLoc, colors.white);
	gl.uniform4fv(diffuseLoc, colors.green);
	gl.uniform4fv(specularLoc, colors.green);

	setInterval(render, 1000 / 60);
	setInterval(changeColor, 1000 * 5); //Change colour every 5 seconds
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform4fv(ambientLoc, colors[Object.keys(colors)[index % Object.keys(colors).length]]);
	gl.uniform4fv(diffuseLoc, colors[Object.keys(colors)[index % Object.keys(colors).length]]);
	gl.uniform4fv(specularLoc, colors[Object.keys(colors)[index % Object.keys(colors).length]]);

	obj.forEach(function (object) {
		object.draw();
	});
	textLoc.innerHTML = Object.keys(colors)[index % Object.keys(colors).length];
}

function changeColor() {
	console.log("Color change is paused: " + isColorChangePaused);
	if (!isColorChangePaused) {
		index++;
	}
}