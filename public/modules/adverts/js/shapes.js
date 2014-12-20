
(function(global){	
	'use strict';
	function createShape(attributes){
		attributes        = attributes       || {};
		attributes._id    = attributes._id   || 0;
		attributes.name   = attributes.name  || 'name';
		attributes.nodes  = attributes.nodes || [];
		var shape   = {};

		//attributes.nodes = _.map( attributes.nodes , function(num) { return [num.x,num.y]; } );
		attributes.nodes = attributes.nodes.map(function(num) { return [num.x,num.y]; } );

		shape.toString = function(){
			return '['+attributes._id+' , '+attributes.name+']';
		};

		shape.toSvgPath = function(){
			//return 'M '+ _.map(attributes.nodes, function(e){return e[0]+' '+e[1]}).join(' L ');
			return 'M '+ attributes.nodes.map(function(e){return e[0]+' '+e[1];}).join(' L ');
		};

		shape.getNodes = function(){
			return attributes.nodes;
		};

		shape.getName = function(){
			return attributes.name;
		};
		shape.getId = function(){
			return attributes._id;
		};
		return shape;
	}

	function createRoad(attributes){
		attributes        = attributes || {};
		attributes.classe = attributes.classe || 'classe';

		var road    = createShape(attributes);
        var superToString = road.toString;
        road.toString = function(){
        	return superToString.apply(road) + ' ,'+attributes.classe;
        };

        road.getClasse = function(){
        	return attributes.classe;
        };

        return road;
	}

	function createBuilding(attributes){
		attributes        = attributes || {};
		var building      = createShape(attributes);
		var tmp = 0,i;

		for (i = 0; i < attributes.nodes.length -1; i++) {
				tmp += Math.abs(attributes.nodes[i][0] * attributes.nodes[i+1][1] - attributes.nodes[i+1][0] * attributes.nodes[i][1]) ;
		}
		attributes.area = tmp/2;
		
		building.getArea  = function(){
        	return attributes.area;
        };
        return building;
	}

	function createAmenity(attributes){
	    attributes      = attributes || {};
		attributes.type = attributes.type || 'type';
		var amenity     = createShape(attributes);

		amenity.getType = function(){
        	return attributes.type;
        };
        return amenity;
	}

	function createNatural(attributes){
		attributes      = attributes || {};
		attributes.type = attributes.type || 'type';
		var natural     = createShape(attributes);

		natural.getType = function(){
        	return attributes.type;
        };
        return natural;
	}
 
	if(typeof window !== 'undefined' && global === window)
	{
		global.shapes = {};
		global.shapes.createRoad     = createRoad;
		global.shapes.createBuilding = createBuilding;
		global.shapes.createAmenity  = createAmenity;
		global.shapes.createNatural  = createNatural;

	}
	else{
		global.createRoad     = createRoad;
		global.createBuilding = createBuilding;
	    global.createAmenity  = createAmenity;
		global.createNatural  = createNatural;
		global.VERSION = '1.1';
	}
})(this);
