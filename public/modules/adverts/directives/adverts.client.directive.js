'use strict';

angular.module('adverts')
	.directive('map', ['$http','$location','shapes','d3','Adverts','AdvertsPID','$', 
	function ($http,$location,shapes,d3,Adverts,AdvertsPID,$){
	
	console.location('shapes');
	function drawShapes(scope,element) 
	{			

		$http.get('/modules/adverts/data/data.json').success(function(data) 
		{
			console.location('shapes');
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

					$('#building').html(buildings.length);
					$('#road').html(roads.length);
				    $('#natural').html(naturals.length);
					$('#amenity').html(amenities.length);

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
					.on('click', function(d, i){
			          	scope.selected_ = d.getId();
			          	scope.$apply();
			          	//Select to the database with the corresponding id and verify if 
			          	//it does not already used
			          	
			          	console.log('I am top');
						$http.get('/adverts/pidroute/' + d.getId().replace('-','')).success(function (response) {
							
							scope.findThat(response);
							console.log('I am in success '+response.pid);
							//var doc = document.getElementById('advert').innerHTML='<h1> Hello</h1>';
							//console.log(scope);
							scope.showAdverts.visible = true;
							//$location.path('adverts/' + response._id);
						}).error(function (err) {//If this pid is not yet use for an another advert
							
							scope.pid = d.getId();
							console.log('I am in error');
							$('#form :input').prop('disabled', false);					       	
						});


			          	console.log('I am bottom');
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