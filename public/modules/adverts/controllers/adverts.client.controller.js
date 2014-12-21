'use strict';

// Adverts controller
angular.module('adverts').controller('AdvertsController', ['$scope', '$stateParams', 
	'$location', 'Authentication', 'Adverts','AdvertsPID','$',
	function($scope, $stateParams, $location, Authentication, Adverts,AdvertsPID,$) {
		$scope.authentication = Authentication;

		//To disable by defaut all form elements inside 'form'
		$('#form :input').prop('disabled', true);
		$scope.showAdverts = {url:'modules/adverts/views/show-advert.client.view.html', 
							 visible:false};

		$scope.includeAdvert =function(advert){
			var doc = document.getElementById('advert');
			doc.innerHTML='<h1> '+advert.description+'</h1> <h2>Hello</h2>';
		}

		// Create new Advert
		$scope.create = function() {
			// Create new Advert object
			var myid  = $scope.selected_;
			myid      = myid.replace('-','');
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
				surface:this.surface,
				prix:this.prix,
				photo:this.photo
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
	}
]);