(function() {
	"use strict";

	Math.radians = function radians(degrees) {
		return degrees * Math.PI / 180;
	};

	function MatrixComportement() {
		this.identity = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}

	MatrixComportement.prototype.setNewIdentity = function setNewIdentity(newIdentity) {
		this.identity = newIdentity;
	};

	MatrixComportement.prototype.matrixConstruction = function matrixConstruction(matrix3d, matrix3dChange) {
		var a = matrix3d;
		var b = matrix3dChange;

		var result = [
			a[0] * b[0] + a[1] * b[4] + a[2] * b[8]  + a[3] * b[12],
			a[0] * b[1] + a[1] * b[5] + a[2] * b[9]  + a[3] * b[13],
			a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
			a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

			a[4] * b[0] + a[5] * b[4] + a[6] * b[8]  + a[7] * b[12],
			a[4] * b[1] + a[5] * b[5] + a[6] * b[9]  + a[7] * b[13],
			a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
			a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

			a[8] * b[0] + a[9] * b[4] + a[10] * b[8]  + a[11] * b[12],
			a[8] * b[1] + a[9] * b[5] + a[10] * b[9]  + a[11] * b[13],
			a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
			a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

			a[12] * b[0] + a[13] * b[4] + a[14] * b[8]  + a[15] * b[12],
			a[12] * b[1] + a[13] * b[5] + a[14] * b[9]  + a[15] * b[13],
			a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
			a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
		];
		return result;
	};

	MatrixComportement.prototype.scale = function scale(newScale) {
		var s = [
			newScale, 0,        0,        0,
			0,        newScale, 0,        0,
			0,        0,        newScale, 0,
			0,        0,        0,        1
		];
		return this.matrixConstruction(this.identity, s);
	};

	MatrixComportement.prototype.translate = function translate(x, y, z, identity) {
		identity = identity || this.identity;

		var t = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1
		];
		return this.matrixConstruction(this.identity, t);
	};

	MatrixComportement.prototype.rotate = function rotate(x, y, z, identity) {
		identity = identity || this.identity;

		var newIdentity = this.rotateX(x, identity);
		newIdentity = this.rotateY(y, newIdentity);
		newIdentity = this.rotateZ(z, newIdentity);
		return newIdentity;
	};

	MatrixComportement.prototype.rotateX = function rotateX(x, identity) {
		identity = identity || this.identity;

		var r = [
			1, 0, 0, 0,
			0, Math.round(Math.cos(x) * 100) / 100, Math.round(-Math.sin(x) * 100) / 100, 0,
			0, Math.round(Math.sin(x) * 100) / 100, Math.round(Math.cos(x) * 100) / 100, 0,
			0, 0, 0, 1
		];

		return this.matrixConstruction(identity, r);
	};

	MatrixComportement.prototype.rotateY = function rotateY(y, identity) {
		identity = identity || this.identity;

		var r = [
			Math.round(Math.cos(y) * 100) / 100, 0, Math.round(Math.sin(y) * 100) / 100, 0,
			0, 1, 0, 0,
			Math.round(-Math.sin(y) * 100) / 100, 0, Math.round(Math.cos(y) * 100) / 100, 0,
			0, 0, 0, 1
		];

		return this.matrixConstruction(identity, r);
	};

	MatrixComportement.prototype.rotateZ = function rotateZ(z, identity) {
		identity = identity || this.identity;

		var r = [
			Math.round(Math.cos(z) * 100) / 100, Math.round(-Math.sin(z) * 100) / 100, 0, 0,
			Math.round(Math.sin(z) * 100) / 100, Math.round(Math.cos(z) * 100) / 100, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];

		return this.matrixConstruction(identity, r);
	};

	function TransformCss(domElem) {
		this.matrixComportement = new MatrixComportement();
		this.domElem = domElem;
	}

	TransformCss.prototype.doTransform = function doTransform(identity) {
		var str = "matrix3d(" + identity[0] + "," + identity[1] + "," + identity[2] + "," + identity[3] + "," +
										identity[4] + "," + identity[5] + "," + identity[6] + "," + identity[7] + "," +
										identity[8] + "," + identity[9] + "," + identity[10] + "," + identity[11] + "," +
										identity[12] + "," + identity[13] + "," + identity[14] + "," + identity[15] + ")";
		this.domElem.style.transform = this.domElem.style.webkitTransform = this.domElem.style.mozTransform = this.domElem.style.msTransform = this.domElem.style.oTransform = str;
	};

	function ImageContext() {
	}

	ImageContext.prototype.insert = function() {
	};

	function ImageDom(width, height, src, style) {
		this.domRef = new Image();
		this.domRef.src = src;
		this.domRef.width = width;
		this.domRef.height = height;
		this.domRef.style.cssText = style; // "position:absolute;opacity:0.9;position:absolute";
	}

	ImageDom.prototype = Object.create(ImageContext.prototype);

	ImageDom.prototype.insert = function(domElem) {
		domElem.appendChild(this.domRef);
	};

	function TwoDForm() {
		this.matrix = new MatrixComportement();
	}

	TwoDForm.prototype.translate = function translate(x, y, z, identity) {
		return this.matrix.translate(x, y, z, identity);
	};

	TwoDForm.prototype.rotate = function(angleX, angleY, angleZ, identity) {
		return this.matrix.rotate(Math.radians(angleX), Math.radians(angleY), Math.radians(angleZ), identity);
	};

	TwoDForm.prototype.rotateX = function rotateX(deg, identity) {
		return this.matrix.rotateX(Math.radians(deg), identity);
	};

	TwoDForm.prototype.rotateY = function rotateY(deg, identity) {
		return this.matrix.rotateY(Math.radians(deg), identity);
	};

	TwoDForm.prototype.rotateZ = function rotateZ(deg, identity) {
		return this.matrix.rotateZ(Math.radians(deg), identity);
	};

	function Rectangle(width, height) {
		TwoDForm.apply(this, [
			[
				{"x": 0, "y": 0, "z": 0},
				{"x": width, "y": 0, "z": 0},
				{"x": width, "y": height, "z": 0},
				{"x": 0, "y": height, "z": 0}
			]
		]);
	}

	Rectangle.prototype = Object.create(TwoDForm.prototype);

	function DomImageRectangle(width, height, srcImage) {
		Rectangle.apply(this, [width, height]);
		this.image = new ImageDom(width, height, srcImage, "opacity:0.9;position:absolute");
		this.transformCss = new TransformCss(this.image.domRef);
	}

	DomImageRectangle.prototype = Object.create(Rectangle.prototype);

	DomImageRectangle.prototype.translate = function translate(x, y, z) {
		var identity = Rectangle.prototype.translate.apply(this, [x, y, z]);
		this.updateTransform(identity);
		return identity;
	};

	DomImageRectangle.prototype.rotateX = function rotateX(deg) {
		var identity = Rectangle.prototype.rotateX.apply(this, [deg]);
		this.updateTransform(identity);
		return identity;
	};

	DomImageRectangle.prototype.rotateY = function rotateY(deg) {
		var identity = Rectangle.prototype.rotateY.apply(this, [deg]);
		this.updateTransform(identity);
		return identity;
	};

	DomImageRectangle.prototype.rotateZ = function rotateZ(deg) {
		var identity = Rectangle.prototype.rotateZ.apply(this, [deg]);
		this.updateTransform(identity);
		return identity;
	};

	DomImageRectangle.prototype.rotate = function rotate(x, y, z) {
		var identity = Rectangle.prototype.rotate.apply(this, [x, y, z]);
		this.updateTransform(identity);
		return identity;
	};

	DomImageRectangle.prototype.updateTransform = function updateTransform(identity) {
		this.transformCss.doTransform(identity);
	};

	function Cube(width) {
		this.setFaces.apply(this, arguments);

		this.front.matrix.setNewIdentity(this.front.translate(0, 0, width / 2));

		var newLeftIdentity = this.left.translate(0, 0, width / 2);
		newLeftIdentity = this.left.rotateY(-90, newLeftIdentity);
		this.left.matrix.setNewIdentity(newLeftIdentity);
		var newBehindIdentity = this.behind.translate(0, 0, width / 2);
		this.behind.matrix.setNewIdentity(this.behind.rotateY(-180, newBehindIdentity));

		var newRightIdentity = this.right.translate(0, 0, width / 2);
		this.right.matrix.setNewIdentity(this.right.rotateY(90, newRightIdentity));

		var newTopIdentity = this.top.translate(0, 0, width / 2);
		this.top.matrix.setNewIdentity(this.top.rotateX(90, newTopIdentity));

		var newBottomIdentity = this.bottom.translate(0, 0, width / 2);
		this.bottom.matrix.setNewIdentity(this.bottom.rotateX(-90, newBottomIdentity));
		/*
		this.bottom.rotateX (-90, true);
		this.bottom.rotateZ (-180, true);
		*/
	}

	Cube.prototype.setFaces = function setFaces(width) {
		this.front = new Rectangle(width, width);
		this.left = new Rectangle(width, width);
		this.behind = new Rectangle(width, width);
		this.right = new Rectangle(width, width);
		this.top = new Rectangle(width, width);
		this.bottom = new Rectangle(width, width);
	};

	Cube.prototype.rotate = function rotate(x, y, z) {
		this.front.rotate(x, y, z);
		this.left.rotate(x, y, z);
		this.behind.rotate(x, y, z);
		this.right.rotate(x, y, z);
		this.top.rotate(x, y, z);
		this.bottom.rotate(x, y, z);
	};

	function DomImgCube(width, image) {
		Cube.apply(this, [width, image]);
	}

	DomImgCube.prototype = Object.create(Cube.prototype);

	DomImgCube.prototype.setFaces = function setFaces(width, image) {
		this.front  = new DomImageRectangle(width, width, image); // identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
		this.left   = new DomImageRectangle(width, width, image); // identity = [0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]
		this.behind = new DomImageRectangle(width, width, image); // identity = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
		this.right  = new DomImageRectangle(width, width, image); // identity = [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]
		this.top    = new DomImageRectangle(width, width, image); // identity = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]
		this.bottom = new DomImageRectangle(width, width, image); // identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]

		this.bloc = document.createElement("div");
		this.bloc.style.cssText = "position:absolute;margin-left:-" + width / 2 + "px;left:50%;margin-top:-" + width / 2 + "px;top:50%;" +
			"-webkit-perspective:1000px;-moz-perspective:1000px;-o-perspective:1000px;-ms-perspective:1000px;perspective:1000px;" +
			"-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-o-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d;";
		this.front.image.insert(this.bloc);
		this.left.image.insert(this.bloc);
		this.behind.image.insert(this.bloc);
		this.right.image.insert(this.bloc);
		this.top.image.insert(this.bloc);
		this.bottom.image.insert(this.bloc);
	};

	DomImgCube.prototype.insert = function insert(domElem) {
		domElem.appendChild(this.bloc);
	};
})();
