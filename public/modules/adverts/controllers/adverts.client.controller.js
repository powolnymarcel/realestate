'use strict';

// Adverts controller
angular.module('adverts').controller('AdvertsController', ['$scope', '$stateParams', 
	'$location', 'Authentication', 'Adverts','AdvertsPID','$','includeService',
	function($scope, $stateParams, $location, Authentication, Adverts,AdvertsPID,$,includeService) {
		
		$scope.init = function () {
			$scope.authentication = Authentication;
			$scope.files          = [];//-->To store all uploaded files
			$scope.filesName      = [];//-->To store all uploaded files names
			//To disable by defaut all form elements inside 'form'
			$('#form :input').prop('disabled', true);
			$scope.showAdverts = {url:'modules/adverts/views/show-advert.client.view.html', 
								 visible:false};
		};


		$scope.zoom = function () {

			$(document).ready(function() {

				function moveButtonClickHandler(e){
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
			// Create new Advert object
			var myid  = ($scope.selectedID_).replace('-','');

			var advert = new Adverts ({
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
				prix:this.prix,
				photo:$scope.filesName
			});

			// Redirect after save
			advert.$save(function(response) {
				$location.path('adverts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
		};

		//Load files uploaded from the brower
		$scope.loadFiles = function () {

			function dragenter(e) {
			  e.stopPropagation();
			  e.preventDefault();
			}

			function dragover(e) {
			  e.stopPropagation();
			  e.preventDefault();
			}

			function drop(e) {
			  e.stopPropagation();
			  e.preventDefault();

			  var dt = e.dataTransfer;
			  var files = dt.files;

			  handleFiles(files);
			}

			var currentIndex  = 0,
				url = '/adverts/upload';
			function handleFiles(files) {
			  for (var i = 0,file=files[i]; i < files.length; i++) {
			    var imageType = /image.*/;
			    
			    if (!file.type.match(imageType)) {
			      continue;
			    }

		        includeService.sendFile(file,url); //Send the file to the server to be move in img folder

				currentIndex = i + $scope.files.length;
				$scope.files[currentIndex]     = files[i];
				$scope.filesName[currentIndex] = $scope.files[currentIndex].name;
				console.log('-->Image : '+$scope.files.length);

				for (i=0;i<$scope.files.length;i++) {
			    	console.log('-->Stored : '+$scope.filesName[i]);
			    }
			    
			    //Add new image element in the ouput
			    var img = document.createElement('img'),
			    preview = document.getElementById('list');
			    img.classList.add('image');
			    img.file = file;
			    preview.appendChild(img); // Assuming that 'preview' is a the div output where the content will be displayed.
			    
			    var reader = new FileReader();
				// Closure to capture the file information.
				reader.onload = (function(aImg) {return function(e) {aImg.src = e.target.result;};})(img);
		        reader.readAsDataURL(file);
			  }//END FOR
			}//END handleFiles

			var dropbox = document.getElementById('dropbox');
			dropbox.addEventListener('dragenter', dragenter, false);
			dropbox.addEventListener('dragover', dragover, false);
			dropbox.addEventListener('drop', drop, false);

           /*
	        function sendFile(file) {
	            var uri = '/adverts/upload';
	            var xhr = new XMLHttpRequest();
	            var fd = new FormData();
	            
	            xhr.open('POST', uri, true);
	            xhr.onreadystatechange = function() {
	                if (xhr.readyState === 4 && xhr.status === 200) {
	                    // Handle response.
	                    alert(xhr.responseText); // handle response.
	                }
	            };
	            fd.append('userFile', file);
	            // Initiate a multipart/form-data upload
	            xhr.send(fd);//no refresh
	        }
	        */

		};//END loadFiles



	}
]);