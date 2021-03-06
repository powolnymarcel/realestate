'use strict';

angular.module('adverts')
	.directive('map', ['$http','$location','shapes','d3','Adverts','AdvertsPID','$','includeService', 
	function ($http,$location,shapes,d3,Adverts,AdvertsPID,$,includeService){
	
	function drawShapes(scope,element) 
	{

		$http.get('/modules/adverts/data/data.json').success(function(data) 
		{

			var buildings = [], roads = [], amenities = [], naturals = [];
				for(var i = data.length - 1; i > 0; i-- )
				{
					if(typeof data[i].building !== 'undefined' && data[i].building === true){
						buildings.push(shapes.createBuilding(data[i]));
					}
					if(typeof data[i].highway !== 'undefined'){
						roads.push(shapes.createRoad(data[i]) );
					}
					if(typeof data[i].natural !== 'undefined'){
						naturals.push(shapes.createNatural(data[i]) );
					}
					if(typeof data[i].amenity !== 'undefined'){
						amenities.push(shapes.createAmenity(data[i]));
					}
				}

				var container = 
				d3.select(element[0]).append('svg')
				                 .attr('width',600)
				                 .attr('height',400)
				                 .append('g')
                                 .attr('transform', 'scale('+(600/800)+')');

				//Drawbuildings
				container.selectAll('.buildings')
				.data(buildings)
				.enter()
				.append('path')
					.classed('buildings',1)
					.attr('d', function(d){return d.toSvgPath();})
					.attr('id',function(d){return d.getId().replace('-','');})
					.on('click', function(d, i){


			          	scope.selectedID_   = d.getId();
			          	scope.selectedArea_ = d.getArea();
			          	scope.$apply();
			          	//Select to the database with the corresponding id and verify if 
			          	//it does not already be used

			        });

				//Drawroads
				container.selectAll('.roads')
				.data(roads)
				.enter()
				.append('path')
				.classed('roads',1)
				.attr('d', function(d){return d.toSvgPath();} );

				//Drawamenities
				container.selectAll('.amenities')
				.data(amenities)
				.enter()
				.append('path')
				.classed('amenities',1)
				.attr('d', function(d){return d.toSvgPath();} );

				//Drawnaturals
				container.selectAll('.naturals ')
				.data(naturals)
				.enter()
				.append('path')
				.classed('naturals ',1)
				.attr('d', function(d){return d.toSvgPath();} );
				//Add mouse and click events
				container.selectAll('path')
				    .on('mouseover', function(d, i){
			          d3.select(this)
			            .classed('over', 1);
			        })
			        .on('mouseout', function(d, i){
			          d3.select(this)
			            .classed('over', 0);
			        });
		});
	}

	//To disable by defaut all form elements inside 'form'
    $('#form :input').prop('disabled', true);
	// To Disable Submit Button By Default
	$('input[type=submit]').attr('disabled','disabled');
	// When User Fills Out Form Completely
	$('form').keyup(function(){
	$('input[type=submit]').removeAttr('disabled');

	});



	return {
		restrict : 'E',
		link: drawShapes
	};

}]);