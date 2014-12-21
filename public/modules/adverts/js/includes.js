'use strict';

angular.module('adverts')
.service('includeService', ['$http','$',
    function($http,$) {
 
        this.includeAdvert = function(advert) {
            document.getElementById('advert').innerHTML=
            '<h1> '+advert.description+'</h1> <h2>Hello</h2>';
        };
    }
]);



