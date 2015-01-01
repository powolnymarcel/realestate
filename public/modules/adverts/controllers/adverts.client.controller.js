'use strict';

// Adverts controller
angular.module('adverts').controller('AdvertsController', ['$scope', '$stateParams', 
	'$location', 'Authentication', 'Adverts','AdvertsPID','$http','$','includeService',
	function($scope, $stateParams, $location, Authentication, Adverts,AdvertsPID,$http,$,includeService) {
	$scope.authentication = Authentication;
		$scope.init = function () {
			$scope.authentication = Authentication; 
			$scope.files          = [];//-->To store files  for uploading using Document.querySelectorAll()
			$scope.filesName      = [];//-->To store all uploaded files names
			$('#form :input').prop('disabled', true);//-->To disable by defaut all form elements inside 'form'
			$scope.showAdverts = {url:'modules/adverts/views/show-advert.client.view.html', 
								 visible:false};
		};


		$scope.zoom = function () {

			$(document).ready(function() {

				function moveButtonClickHandler(e){
					$('#ptr').remove();
			    	var pixelsToMoveOnX = 0;
					var pixelsToMoveOnY = 0;
			
					switch(e.target.id){
						case 'leftPositionMap':
							pixelsToMoveOnX = 50;	
						break;
						case 'rightPositionMap':
							pixelsToMoveOnX = -50;
						break;
						case 'topPositionMap':
							pixelsToMoveOnY = 50;	
						break;
						case 'bottomPositionMap':
							pixelsToMoveOnY = -50;	
						break;
					}
					$('#imgContainer').smartZoom('pan', pixelsToMoveOnX, pixelsToMoveOnY);
			    }

			    function zoomButtonClickHandler(e){
			    	$('#ptr').remove();
			    	var scaleToAdd = 1.2;
					if(e.target.id === 'zoomOutButton')
						scaleToAdd = -scaleToAdd;
					$('#imgContainer').smartZoom('zoom', scaleToAdd);
			    }
				

				$('#imgContainer').smartZoom({'containerClass':'zoomableContainer'});
				
				$('#topPositionMap,#leftPositionMap,#rightPositionMap,#bottomPositionMap').bind('click', moveButtonClickHandler);
  				$('#zoomInButton,#zoomOutButton').bind('click', zoomButtonClickHandler);
			});
		};


		// Create new Advert
		$scope.create = function() {
			var myid  = ($scope.selectedID_).replace('-','');
<<<<<<< HEAD
			var form = {
				name: this.name,
				pid:myid,
				region:this.region,
				codepostale:this.codepostale,
				nom:this.nom,
				prenom:this.prenom,
				email:this.email,
				tel:this.tel,
				titre:this.titre,
				description:this.description,
				surface: $scope.selectedArea_,
				prix:this.prix
			};
			// Create new Advert object
			var fd = new FormData();
            fd.append('file', $scope.files[0]);


			$http.post('/adverts/upload', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).
			  success(function(data, status, headers, config) {
			  		console.log('posting');
			  		data.replace('"','');
            		console.log(data);
					console.log('-->form.nom::: '+ form.nom);
					var advert = new Adverts ({
						name: form.name,
						pid:form.pid,
						region:form.region,
						codepostale:form.codepostale,
						nom:form.nom,
						prenom:form.prenom,
						email:form.email,
						tel:form.tel,
						titre:form.titre,
						description:form.description,
						surface: form.surface,
						prix:form.prix,
						photo:data
					});

					// Redirect after save
					advert.$save(function(response) {
						$location.path('adverts/' + response._id);
						// Clear form fields
						$scope.name = '';
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});	 
					  
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
=======
			var form  = {
					name: this.name,
					pid:myid,
					region:this.region,
					codepostale:this.codepostale,
					nom:this.nom,
					prenom:this.prenom,
					email:this.email,
					tel:this.tel,
					titre:this.titre,
					description:this.description,
					surface: $scope.selectedArea_,
					prix:this.prix
			    };
			//Returns a list of the elements within the document which have image css class
			var imgs  = document.querySelectorAll('.image');
			var count = 0;

            for (var i= 0; i<imgs.length; i++) 
            {
	           	var fd = new FormData();
	           	fd.append('file',imgs[i].file);
				$http.post('/adverts/upload', fd,{
	                transformRequest: angular.identity,
	                headers: {'Content-Type': undefined}
	            }).
				  success(function(filesname) {
				  	$scope.filesName.push(filesname.photo);
				  		if(count == imgs.length-1){
						var advert = new Adverts ({
							name: form.name,
							pid:form.pid,
							region:form.region,
							codepostale:form.codepostale,
							nom:form.nom,
							prenom:form.prenom,
							email:form.email,
							tel:form.tel,
							titre:form.titre,
							description:form.description,
							surface: form.surface,
							prix:form.prix,
							photo:$scope.filesName
						});
						// Redirect after save
						advert.$save(function(response) {
							$location.path('adverts/' + response._id);
							// Clear form fields
							$scope.name = '';
						}, function(errorResponse) {
							$scope.error = errorResponse.data.message;
						});	 }
						count++;
				  }).
				  error(function(err) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				  });
			}//END for
>>>>>>> 3ab493fb80622bd34a30102c78281ac52150d2eb
		};

		// Remove existing Advert
		$scope.remove = function(advert) {
			if ( advert ) { 
				advert.$remove();

				for (var i in $scope.adverts) {
					if ($scope.adverts [i] === advert) {
						$scope.adverts.splice(i, 1);
					}
				}
			} else {
				$scope.advert.$remove(function() {
					$location.path('adverts');
				});
			}
		};

		// Update existing Advert
		$scope.update = function() {
			var advert = $scope.advert;

			advert.$update(function() {
				$location.path('adverts/' + advert._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Adverts
		$scope.find = function() {
			$scope.adverts = Adverts.query();
		};

		// Find existing Advert
		$scope.findOne = function() {
			$scope.advert = Adverts.get({ 
				advertId: $stateParams.advertId
			});
		};

	    // Find existing Realestate by the pid
		$scope.findAdvertByPID = function(response) {
			console.log('findAdvertByPID');
			$scope.data = response;
			$scope.advert = AdvertsPID.get({ 
				advertPID: response.pid
			});
			console.log('found');
		};

		//Load files uploaded from the brower
		//As the drag-and-drop operation (or the input[type=file]) contains a file object
		$scope.dragandrop = function () {
			function dragenter(e) {
			  e.stopPropagation();
			  e.preventDefault();
			}

			function dragover(e) {
			  e.stopPropagation();
			  e.preventDefault();
			}

			function drop(evt) {
			  evt.stopPropagation();
			  evt.preventDefault();
			  handleFileSelect(evt);
			}//END drop

			var dropbox = document.getElementById('dropbox');
			dropbox.addEventListener('dragenter', dragenter, false);
			dropbox.addEventListener('dragover', dragover, false);
			dropbox.addEventListener('drop', drop, false); 
		};//END Darg and drop

		$scope.loadFilesFromInput = function() {
		  var dropbox=document.getElementById('files');
		  dropbox.addEventListener('change', handleFileSelect, false);
		};

		function handleFileSelect(evt) { 
			//handle from input or from drag and drop
		      var files = evt.target.files || evt.dataTransfer.files;
			  for (var i = 0,file=files[i]; i < files.length; i++) {
<<<<<<< HEAD
			    var imageType = 'image.*';
			    
			    if (!file.type.match(imageType)) {
			      continue;
			    }

			    $scope.files.push(file);//-->Files will be sent while creating new advert
				$scope.filesName.push(file.name);
				for (i=0;i<$scope.filesName.length;i++) {
			    	console.log('-->Stored : '+$scope.filesName[i]);
			    }
			    
=======
			    var imageType = /image.*/;
			    if (!file.type.match(imageType)) {continue;}
			    $scope.files.push(file);//-->Files will be sent while creating new advert		    
>>>>>>> 3ab493fb80622bd34a30102c78281ac52150d2eb
			    //Add new image element in the ouput
			    var img = document.createElement('img'),
			    preview = document.getElementById('list');
			    img.classList.add('image');
			    img.file = file;
			    preview.appendChild(img); //Assuming that 'preview' is a the div output where the content will be displayed.
			    
			    var reader = new FileReader();
				//Closure to capture the file information.
				reader.onload = (function(aImg) {
					return function(e) {aImg.src = e.target.result;
						//$scope.files.push(e.target.result);//-->stored files using binary format
					};})(img);
		        reader.readAsDataURL(file);
			  }//END FOR
		 }//END handleFileSelect

	}
]);