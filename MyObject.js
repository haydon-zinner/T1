function MyObject(meshLocation, textureLocation, scale, position, rotation) {
	this.model = new ObjParser(meshLocation);
	this.texture = new TGAParser(textureLocation);
	this.scaleSize = scale / this.model.radius;
	this.position = position;

	// Create the model matrix.
	this.scaleMatrix = scalem(this.scaleSize, this.scaleSize, this.scaleSize);
	this.translateMatrix = position;
	this.rotateMatrix = rotation;
	this.offsetMatrix = translate(-this.model.center[0], -this.model.center[1], -this.model.center[2]);
	this.modelMatrix = mult(this.translateMatrix, mult(this.rotateMatrix, mult(this.scaleMatrix, this.offsetMatrix)));

	this.rotation = 0;

	// Load the positional data into the GPU
	this.posBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.model.vertexPositions), gl.STATIC_DRAW);

	//Load the color data into the GPU
	this.colBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.model.vertexTextures), gl.STATIC_DRAW);

	// Load the normal data into the GPU
	this.norBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.norBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.model.vertexNormals), gl.STATIC_DRAW);

	this.draw = function () {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
		gl.uniform1i(gl.getUniformLocation(program, "myTexture"), 0);

		let vPos = gl.getAttribLocation(program, "aPosition");
		let vCol = gl.getAttribLocation(program, "aTextureCoordinate");
		let vNor = gl.getAttribLocation(program, "aNormal");

		gl.enableVertexAttribArray(vPos);
		gl.enableVertexAttribArray(vCol);
		gl.enableVertexAttribArray(vNor);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBufferId);
		gl.vertexAttribPointer(vPos, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colBufferId);
		gl.vertexAttribPointer(vCol, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.norBufferId);
		gl.vertexAttribPointer(vNor, 3, gl.FLOAT, false, 0, 0);

		this.rotation +=0.20;

		this.worldMatrix = mult(camera.viewMatrix, mult(rotate(this.rotation, [0, 1, 0]), this.modelMatrix));

		let trInvWorldMatrix = inverse(transpose(this.worldMatrix));

		//Finally, draw the object
		gl.uniformMatrix4fv(worldMatrixLocation, false, flatten(this.worldMatrix));
		gl.uniformMatrix4fv(gl.getUniformLocation(program, "uViewMatrix"), false, flatten(camera.viewMatrix));
		gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjMatrix"), false, flatten(camera.projectionMatrix));
		gl.uniformMatrix4fv(gl.getUniformLocation(program, "uTransposeInverseWorldMatrix"), false, flatten(trInvWorldMatrix));
		gl.drawArrays(gl.TRIANGLES, 0, this.model.vertexPositions.length);
	};
}