'use strict';

// Adverts controller
angular.module('adverts').controller('AdvertsController', ['$scope', '$stateParams', 
	'$location', 'Authentication', 'Adverts','AdvertsPID','$','includeService',
	function($scope, $stateParams, $location, Authentication, Adverts,AdvertsPID,$,includeService) {
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

				//SEND all file to the server to be moved in img folder
				var uri = '/adverts/upload';
				for (var i = $scope.files.length - 1; i >= 0; i--) {
					includeService.sendXMLHTTPFile($scope.files[i], uri);
					//includeService.sendHTTPPOSTFile($scope.files[i], uri);
				}

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
			}//END drop

			var currentIndex  = 0;
			function handleFiles(files) {
			  for (var i = 0,file=files[i]; i < files.length; i++) {
			    var imageType = /image.*/;
			    
			    if (!file.type.match(imageType)) {
			      continue;
			    }
				
				currentIndex = i + $scope.filesName.length;
				$scope.filesName[currentIndex] = file.name;
				for (i=0;i<$scope.filesName.length;i++) {
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
				reader.onload = (function(aImg) {
					return function(e) {aImg.src = e.target.result;
						$scope.files.push(e.target.result);
						//console.log(' path : '+e.target.result.path);
					};})(img);
		        reader.readAsDataURL(file);
			  }//END FOR
			}//END handleFiles

			var dropbox = document.getElementById('dropbox');
			dropbox.addEventListener('dragenter', dragenter, false);
			dropbox.addEventListener('dragover', dragover, false);
			dropbox.addEventListener('drop', drop, false); 
		};//END loadFiles



	}
]);