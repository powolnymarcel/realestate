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
		$scope.findThat = function(response) {
			console.log('findThat');
			$scope.data = response;
			$scope.advert = AdvertsPID.get({ 
				advertPID: response.pid
			});
		};

		//Load files uploaded from the brower
		$scope.loadFiles = function () {

			function handleFileSelect(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				var files = evt.dataTransfer.files, //-->files is a FileList of File objects.
				output = [],      //-->Some informations about files will be stored in this array
				currentIndex  = 0;//-->To allow uploading multiple files

				for (var i = 0,f = files[i];i<files.length; i++)  {
				  currentIndex = i + $scope.files.length;
				  $scope.files[currentIndex]     = files[i];
				  $scope.filesName[currentIndex] = $scope.files[currentIndex].name;
			      output.push('<li><strong>',f.name,'</strong></li>');

				  console.log('-->Image : '+$scope.files.length);
			    }
			    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
			    
			    //Dislay files names stored
			    for (i=0;i<$scope.files.length;i++) {
			    	console.log('-->Stored : '+$scope.filesName[i]);
			    }
			}

			function handleDragOver(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				evt.dataTransfer.dropEffect = 'copy'; 
			}

			var dropZone = document.getElementById('dropzone');
			dropZone.addEventListener('dragover', handleDragOver, false);
			dropZone.addEventListener('drop', handleFileSelect, false);
		};
	}
]);