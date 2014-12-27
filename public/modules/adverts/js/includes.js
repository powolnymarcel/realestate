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



        this.sendHTTPPOSTFile = function(file, uploadUrl){
            console.log('$http.post sends to '+uploadUrl);
            var data = new FormData();
            data.append('userFile', file);
            $http.post(uploadUrl, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                console.log('sendHTTPPOSTFile function performed send with success.');
            })
            .error(function(){
                console.log('sendHTTPPOSTFile function generate error. File is not being sent .');
            });
        };

        this.sendXMLHTTPFile = function(file, uploadUrl) {
                var xhr = new XMLHttpRequest();
                var fd = new FormData();
                
                xhr.open('POST',uploadUrl,true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // Handle response.
                        console(xhr.responseText); // handle response.
                    }
                };
                fd.append('userFile', file);
                //Initiate a multipart/form-data upload
                console.log('XMLHTTPrequest sends file to'+uploadUrl);
                xhr.send(fd);//no refresh 
        };



    }
]);



