'use strict';

// Adverts controller
angular.module('adverts').controller('AdvertsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Adverts',
	function($scope, $stateParams, $location, Authentication, Adverts) {
		$scope.authentication = Authentication;

		// Create new Advert
		$scope.create = function() {
			// Create new Advert object
			var advert = new Adverts ({
				name: this.name
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
	}
]);