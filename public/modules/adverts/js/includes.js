'use strict';

angular.module('adverts')
.service('includeService', ['$http','$',
    function($http,$) {
       var docs=100;
 
        this.getDocs = function() {
            return docs;
        };
    }
]);



