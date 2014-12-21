'use strict';

angular.module('adverts')
.service('includeService', ['$http','$',
    function($http,$) {
 
        this.includeAdvert = function(advert) {

        	var docs ='<div class="col-sm-4"><img src="modules/adverts/img/'+advert.photo+'"class="image">'+
        	          '</div> <div class="col-sm-7">'+
        	          '<span>'+advert.region+'</span><br/>'+
              	      '<span>'+advert.description+'</span>'+
                      '</div>';
            document.getElementById('advert').innerHTML= docs;
        };
    }
]);



