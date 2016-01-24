/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype

(function(){
/*    var Type = function(nature){
        var returnFunction = function(value){
            this.setValue (value);
        };
        returnFunction.prototype = Type.prototype;
        return function(value){
            return new returnFunction(value);
        }
    };
    var value = null;
 
    Type.prototype = (function(){
        return {
            setValue : function (newValue){
                if (newValue === null || newValue instanceof nature || newValue !== null && newValue.constructor === nature){
                    value = newValue;
                }
            },
            getValue : function (){
                return value;
            }
        };
    })();
    Int = new Type (Number);
    Int (4);*/
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function(){};

	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;
  
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
  
		// Copy the properties over onto the new prototype
		for (var name in prop) {
		  // Check if we're overwriting an existing function
		  prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn){
			  return function() {
				var tmp = this._super;
			  
				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = _super[name];
			  
				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);       
				this._super = tmp;
			  
				return ret;
			  };
			})(name, prop[name]) :
			prop[name];
		}
	  
		// The dummy class constructor
		function Class() {
		  // All construction is actually done in the init method
		  if ( !initializing && this.init )
			this.init.apply(this, arguments);
		}
	  
		// Populate our constructed prototype object
		Class.prototype = prototype;
     
     // New fonction to control instance before add à new value
		Class.prototype._define = function (value, instance) {
			if (value === null || value instanceof instance || value !== null && value.constructor === instance)
				 return value;
			else {
				if (window.console)
					console.error ("_define : instanceof value incorrect. ", value, instance);
				return null;
			}
		};

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;
	 
		// And make this class extendable
		Class.extend = arguments.callee;
	  
		return Class;
	};
})();

Point = Class.extend ({
	init : function (x, y, z){
		this.x = x;
		this.y = y;
		this.z = z || 0;
	},
	deplacer : function (decalX, decalY, decalZ){
		this.x += decalX;
		this.y += decalY;
		this.z += decalZ || 0;
	}
});

Ligne = Class.extend ({
	init : function (startX, startY, startZ, endX, endY, endZ){
		this.pointStart = new Point (startX, startY, startZ);
		this.pointEnd = new Point (endX, endY, endZ);
		this.centreGravite = {x:0, y:0, z:0};
	},
	deplacer:function (decalX, decalY, decalZ){
		this.pointStart.deplacer (decalX, decalY, decalZ);
		this.pointEnd.deplacer (decalX, decalY, decalZ);
	}
/*	rotater : function (angleX, angleY, angleZ) {
		this.rotateX (angleX);
		this.rotateY (angleY);
		this.rotateZ (angleZ);
	},
	rotateX : function (){
		this.pointStart.y = Math.sqrt(Math.pow((this.pointStart.y - this.centreGravite.y),2)+Math.pow(this.pointStart.z - this.centreGravite.z,2))*-Math.sin(Math.radians(angleX))-(this.centreGravite.y - this.pointStart.y);
		this.pointStart.z = Math.sqrt(Math.pow((this.pointStart.x - this.centreGravite.x),2)+Math.pow(this.pointStart.y - this.centreGravite.y,2))*Math.cos(Math.radians(angleX))-(this.centreGravite.x - this.pointStart.x);
	},
	rotateX : function (){
		this.pointStart.x = Math.sqrt(Math.pow((this.pointStart.x - this.centreGravite.x),2)+Math.pow(this.pointStart.y - this.centreGravite.y,2))*Math.sin(Math.radians(angleY))-(this.centreGravite.y - this.pointStart.y);
		this.pointStart.z = Math.sqrt(Math.pow((this.pointStart.x - this.centreGravite.x),2)+Math.pow(this.pointStart.y - this.centreGravite.y,2))*Math.cos(Math.radians(angleY))-(this.centreGravite.x - this.pointStart.x);
	},
	rotateZ : function (){
		this.pointStart.y = Math.sqrt(Math.pow((this.pointStart.x - this.centreGravite.x),2)+Math.pow(this.pointStart.y - this.centreGravite.y,2))*Math.sin(Math.radians(angleZ))-(this.centreGravite.y - this.pointStart.y);
		this.pointStart.x = Math.sqrt(Math.pow((this.pointStart.x - this.centreGravite.x),2)+Math.pow(this.pointStart.y - this.centreGravite.y,2))*Math.cos(Math.radians(angleZ))-(this.centreGravite.x - this.pointStart.x);
	}
*/
});

Face2D = Class.extend ({
	init : function(lignesEnContinu){
		this.nbLignes = lignesEnContinu.length;
		this.lignes = [];
		for (var i = 1; i < this.nbLignes; i++){
			this.lignes.push (new Ligne(lignesEnContinu[i-1].x, lignesEnContinu[i-1].y, lignesEnContinu[i-1].z, lignesEnContinu[i].x, lignesEnContinu[i].y, lignesEnContinu[i].z));
		}
		this.lignes.push (new Ligne (lignesEnContinu[this.nbLignes-1].x, lignesEnContinu[this.nbLignes-1].y, lignesEnContinu[this.nbLignes-1].x, lignesEnContinu[0].x, lignesEnContinu[0].y, lignesEnContinu[0].z));
		this.transitionCss = new ComportementTransition();
	},
	translate : function (x, y, z, effetAdditionne){
		this.transitionCss.translate (x, y, z, effetAdditionne);
		this.transitionCss.matrixToTransform ();
	},
	rotate : function (angleX, angleY, angleZ, effetAdditionne){
		this.transitionCss.rotate (Math.radians(angleX), Math.radians(angleY), Math.radians(angleZ), effetAdditionne);
		this.transitionCss.matrixToTransform ();
	},
	rotateX : function (deg, effetAdditionne){
		this.transitionCss.rotateX (Math.radians(deg), effetAdditionne);
		this.transitionCss.matrixToTransform ();
	},
	rotateY : function (deg, effetAdditionne){
		this.transitionCss.rotateY (Math.radians(deg), effetAdditionne);
		this.transitionCss.matrixToTransform ();
	},
	rotateZ : function (deg, effetAdditionne){
		this.transitionCss.rotateZ (Math.radians(deg), effetAdditionne);
		this.transitionCss.matrixToTransform ();
	}
});

ComportementImage = Class.extend({ 
	inserer : function (domElem){
	}
});

ImageDOM = ComportementImage.extend({ 
	init : function (width, height, src){
		this.domRef = new Image ();
		this.domRef.src = src;
		this.domRef.width = width;
		this.domRef.height = height;
        this.domRef.style.cssText = "position:absolute;opacity:0.9;position:absolute";
	},
	inserer : function (domElem){
		domElem.appendChild (this.domRef); 
	}
});

ImageCSS = ComportementImage.extend({
	init : function (width, height, src){
	// code à faire
	},
	transform : function (decalX, decalY, rotateX, rotateY){ 
	// code à faire
	},
	inserer : function (domElem){
	// code à faire
	}
});

ImageCanvas = ComportementImage.extend({
	init : function (width, height, src){
	// code à faire
	},
	transform : function (decalX, decalY, rotateX, rotateY){ 
	// code à faire
	},
	inserer : function (domElem){
	// code à faire
	}
});

/*
ComportementTransition = Class.extend({
	// comportement par défaut sans effet
    identity : [1, 0, 0, 0, 1, 0, 0, 0, 1],
	elem : null, // abstract
	matrixConstruction : function (b) {
        var a = this.identity,		
			result = [
			a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
			a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
			a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
			
			a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
			a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
			a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
        
			a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
			a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
			a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
		];
        
        this.identity = result;
    },
    translate : function (x, y, effetAdditionne) {
		if (!effetAdditionne) {
			this.identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}
        var n = [
            1, 0, x,
            0, 1, y,
            0, 0, 1
        ];
        this.matrixConstruction(n);
    },
	rotate : function (angleX, angleY, angleZ, effetAdditionne) {
		if (!effetAdditionne) {
			this.identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}
		this.rotateX (angleX, true);
		this.rotateY (angleY, true);
		this.rotateZ (angleZ, true);
	},
	
    rotateX : function (angleX, effetAdditionne) {
		if (!effetAdditionne) {
			this.identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}
        var n = [
			1, 0, 0,
			0, Math.round(Math.cos(angleX)*100)/100, Math.round(-Math.sin(angleX)*100)/100,
			0, Math.round(Math.sin(angleX)*100)/100, Math.round(Math.cos(angleX)*100)/100
		];
		this.matrixConstruction(n);
    },

    rotateY : function (angleY, effetAdditionne) {
		if (!effetAdditionne) {
			this.identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}
        var n = [
			Math.round(Math.cos(angleY)*100)/100, 0, Math.round(Math.sin(angleY)*100)/100,
			0, 1, 0,
			Math.round(-Math.sin(angleY)*100)/100, 0, Math.round(Math.cos(angleY)*100)/100
        ];
		this.matrixConstruction(n);
    },
    
    rotateZ : function (angleZ, effetAdditionne) {
		if (!effetAdditionne) {
			this.identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}
		var n = [
			Math.round(Math.cos(angleZ)*100)/100, Math.round(-Math.sin(angleZ)*100)/100, 0,
			Math.round(Math.sin(angleZ)*100)/100, Math.round(Math.cos(angleZ)*100)/100, 0,
			0, 0, 1
		];
		this.matrixConstruction(n);
    },

	// abstract
    matrixToTransform : function() {
	}
});*/

ComportementTransition = Class.extend({
	// comportement par défaut sans effet
    identity : [1, 0, 0, 0,
	            0, 1, 0, 0,
		        0, 0, 1, 0,
		        0, 0, 0, 1],
	elem : null, // abstract
	setNewIdentityAsDefault : function (){
		this.identity = this.newIdentity;
	},
	matrixConstruction : function (b) {
        var a = this.newIdentity,
			result = [
			a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12],
			a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13],
			a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14],
			a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15],
			
			a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12],
			a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13],
			a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14],
			a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15],
        
			a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12],
			a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13],
			a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14],
			a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15],
			
			a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12],
			a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13],
			a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14],
			a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]
		];
        
        this.newIdentity = result;
    },
	scale : function (scale) {
		if (!effetAdditionne) {
			this.newIdentity = this.identity;
		}
        var s = [
            scale, 0, 0, 0,
            0, scale, 0, 0,
            0, 0, scale, 0,
			0, 0, 0, 1
        ];
        this.matrixConstruction(n);
	},
	
    translate : function (x, y, z, effetAdditionne) {
		if (!effetAdditionne) {
			this.newIdentity = this.identity;
		}
        var n = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
			x, y, z, 1
        ];
        this.matrixConstruction(n);
    },
	rotate : function (angleX, angleY, angleZ, effetAdditionne) {
		if (!effetAdditionne) {
			this.newIdentity = this.identity;
		}
		this.rotateX (angleX, true);
		this.rotateY (angleY, true);
		this.rotateZ (angleZ, true);
	},
	
    rotateX : function (angleX, effetAdditionne) {
		if (!effetAdditionne) {
			this.newIdentity = this.identity;
		}
        var n = [
			1, 0, 0, 0,
			0, Math.round(Math.cos(angleX)*100)/100, Math.round(-Math.sin(angleX)*100)/100, 0,
			0, Math.round(Math.sin(angleX)*100)/100, Math.round(Math.cos(angleX)*100)/100, 0,
			0, 0, 0, 1
		];
		this.matrixConstruction(n);
    },

    rotateY : function (angleY, effetAdditionne) {
		if (!effetAdditionne) {
			this.newIdentity = this.identity;
		}
        var n = [
			Math.round(Math.cos(angleY)*100)/100, 0, Math.round(Math.sin(angleY)*100)/100, 0,
			0, 1, 0, 0,
			Math.round(-Math.sin(angleY)*100)/100, 0, Math.round(Math.cos(angleY)*100)/100, 0,
			0, 0, 0, 1
        ];
		this.matrixConstruction(n);
    },
    
    rotateZ : function (angleZ, effetAdditionne) {
		if (!effetAdditionne) {
			this.newIdentity = this.identity;
		}
		var n = [
			Math.round(Math.cos(angleZ)*100)/100, Math.round(-Math.sin(angleZ)*100)/100, 0, 0,
			Math.round(Math.sin(angleZ)*100)/100, Math.round(Math.cos(angleZ)*100)/100, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		this.matrixConstruction(n);
    },

	// abstract
    matrixToTransform : function() {
	}
});

TransitionCss = ComportementTransition.extend({
	init : function (elem) {
		this.elem = elem;
		this.newIdentity=this.identity;
	},
    matrixToTransform : function() {
        var str = "matrix3d("+this.newIdentity[0]+","+this.newIdentity[1]+","+this.newIdentity[2]+","+this.newIdentity[3]+","+
		                      this.newIdentity[4]+","+this.newIdentity[5]+","+this.newIdentity[6]+","+this.newIdentity[7]+","+
		                      this.newIdentity[8]+","+this.newIdentity[9]+","+this.newIdentity[10]+","+this.newIdentity[11]+","+
                              this.newIdentity[12]+","+this.newIdentity[13]+","+this.newIdentity[14]+","+this.newIdentity[15]+")";
        this.elem.style.transform = this.elem.style.webkitTransform = this.elem.style.mozTransform = this.elem.style.msTransform = this.elem.style.oTransform = str;
    }
});

Rectangle = Face2D.extend ({ 
	init : function (width, height){
		this._super ([{x:0,y:0,z:0},{x:width,y:0,z:0},{x:width,y:height,z:0},{x:0,y:height,z:0}]);
	}
});

RectangleAvecDomImage = Rectangle.extend ({
	init : function (width, height, srcImage){
		this._super (width, height);
		this.image = new ImageDOM (width, height, srcImage);
		this.transitionCss = new TransitionCss (this.image.domRef);
//		this.transitionCss.setIdentity();
	}
});

Cube = Class.extend ({ 
	init : function (width){
		this.faceAvant = new Rectangle (width, width);
		this.coteGauche = new Rectangle (width, width);
		this.faceArriere = new Rectangle (width, width);
		this.coteDroit = new Rectangle (width, width);
		this.dessus = new Rectangle (width, width);
		this.dessous = new Rectangle (width, width);
		
		this.faceAvant.translate (0,0,width/2, true);
		this.faceAvant.transitionCss.setNewIdentityAsDefault();
		
		this.coteGauche.translate (0,0,width/2, true);
		this.coteGauche.rotateY (-90, true);
		this.coteGauche.transitionCss.setNewIdentityAsDefault();
		
		this.faceArriere.translate (0,0,width/2, true);
		this.faceArriere.rotateY (-180, true);
		this.faceArriere.transitionCss.setNewIdentityAsDefault();
		
		this.coteDroit.translate (0,0,width/2, true);
		this.coteDroit.rotateY (90, true);
		this.coteDroit.transitionCss.setNewIdentityAsDefault();
		
		this.dessus.translate (0,0,width/2, true);
		this.dessus.rotateX (90, true);
		this.dessus.transitionCss.setNewIdentityAsDefault();
		
		this.dessous.translate (0,0,width/2, true);
		this.dessous.rotateX (-90, true);
		this.dessous.rotateZ (-180, true);
		this.dessous.transitionCss.setNewIdentityAsDefault();
	},
	rotate : function (angleX, angleY, angleZ){
		this.faceAvant.rotate (angleX, angleY, angleZ);
		this.coteGauche.rotate (angleX, angleY, angleZ);
		this.faceArriere.rotate (angleX, angleY, angleZ);
		this.coteDroit.rotate (angleX, angleY, angleZ);
		this.dessus.rotate (angleX, angleY, angleZ);
		this.dessous.rotate (angleX, angleY, angleZ);
	}
});

CubeAvecDomImage = Cube.extend ({
	init : function (width, image){
		this.faceAvant = new RectangleAvecDomImage (width, width, image); // identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
		this.coteGauche = new RectangleAvecDomImage (width, width, image); // identity = [0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]
		this.faceArriere = new RectangleAvecDomImage (width, width, image); // identity = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
		this.coteDroit = new RectangleAvecDomImage (width, width, image); // identity = [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]
		this.dessus = new RectangleAvecDomImage (width, width, image); // identity = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]
		this.dessous = new RectangleAvecDomImage (width, width, image); // identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]
		
		this.bloc = document.createElement ("div");
		this.bloc.style.cssText="position:absolute;margin-left:-"+width/2+"px;left:50%;margin-top:-"+width/2+"px;top:50%;-webkit-perspective:1000px;-moz-perspective:1000px;-o-perspective:1000px;-ms-perspective:1000px;perspective:1000px;-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-o-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d;";
		this.faceAvant.image.inserer (this.bloc);
		this.coteGauche.image.inserer (this.bloc);
		this.faceArriere.image.inserer (this.bloc);
		this.coteDroit.image.inserer (this.bloc);
		this.dessus.image.inserer (this.bloc);
		this.dessous.image.inserer (this.bloc);
		
		this.faceAvant.translate (0,0,width/2, true);
		this.faceAvant.transitionCss.setNewIdentityAsDefault();
		
		this.coteGauche.translate (0,0,width/2, true);
		this.coteGauche.rotateY (-90, true);
		this.coteGauche.transitionCss.setNewIdentityAsDefault();
		
		this.faceArriere.translate (0,0,width/2, true);
		this.faceArriere.rotateY (-180, true);
		this.faceArriere.transitionCss.setNewIdentityAsDefault();
		
		this.coteDroit.translate (0,0,width/2, true);
		this.coteDroit.rotateY (90, true);
		this.coteDroit.transitionCss.setNewIdentityAsDefault();
		
		this.dessus.translate (0,0,width/2, true);
		this.dessus.rotateX (90, true);
		this.dessus.transitionCss.setNewIdentityAsDefault();
		
		this.dessous.translate (0,0,width/2, true);
		this.dessous.rotate (-90, 0, 0, true);
		this.dessous.transitionCss.setNewIdentityAsDefault();
	},
	inserer : function(domElem){
		domElem.appendChild (this.bloc);
	}
});

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};