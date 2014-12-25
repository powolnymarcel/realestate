'use strict';

angular.module('adverts')
.service('includeService', ['$http','$',
    function($http,$) {
 
        this.includeAdvert = function(advert) {

        	var docs ='<div class="col-sm-4"><img src="modules/adverts/img/'+advert.photo+'"class="image">'+
        	          '</div> <div class="col-sm-7">'+
        	          '<span style="font-weight: bold;">  '+advert.region+'</span><br/>'+
              	      '<span>'+advert.surface+' M², '+advert.prix+' €</span><br/>'+
                      '</div>';
            document.getElementById('advert').innerHTML= docs;
        };



        this.sendFile = function(file, uploadUrl){
            var data = new FormData();
            data.append('file', file);
            $http.post(uploadUrl, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                console.log('sendFile function performed send with success.');
            })
            .error(function(){
                console.log('sendFile function generate error.No sending file.');
            });
        };



    }
]);



