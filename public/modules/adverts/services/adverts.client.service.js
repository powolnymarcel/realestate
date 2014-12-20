'use strict';

//Adverts service used to communicate Adverts REST endpoints
angular.module('adverts')
.factory('Adverts', ['$resource',
	function($resource) {
		return $resource('adverts/:advertId', { advertId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('d3', ['$window',
	    function($window) {
	        return $window.d3;
	    }
	])
.factory('shapes', ['$window',
    function($window) {
        return $window.shapes;
    }
])
.factory('$', ['$window',
    function($window) {
        return $window.$;
    }
])
.factory('AdvertsPID', ['$resource',
	function($resource) {
		return $resource('adverts/:advertsPID', { realestatePID: '@pid'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);