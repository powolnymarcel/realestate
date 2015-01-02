'use strict';

angular.module('adverts')
.service('includeService', ['$http','$',
    function($http,$) {
 
        this.includeAdvert = function(advert) {

        	var docs ='<div class="col-sm-4"><img src="modules/adverts/img/users/'+advert.photo[0].photo+'"class="image">'+
        	          '</div> <div class="col-sm-7">'+
        	          '<span style="font-weight: bold;">  '+advert.region+'</span><br/>'+
              	      '<span>'+advert.area+' M², '+advert.price+' €</span><br/>'+
                      '</div>';
            document.getElementById('advert').innerHTML= docs;
        };



        this.sendHTTPPOSTFile = function(file, uploadUrl){
            console.log('$http.post sends to '+uploadUrl);

            var data = new FormData();//-->A set of key/value pairs to send using XMLHttpRequest
            data.append('file', file);
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
                var xhr = new XMLHttpRequest(),
                    fd  = new FormData();
                fd.append('file', file);
                
                xhr.open('POST',uploadUrl,true);
                xhr.onload = function () {
                  if (xhr.status === 200) {
                    console.log('all done: ' + xhr.status);
                  } else {
                    console.log('Something went terribly wrong...');
                  }
                };
                //Initiate a multipart/form-data upload
                console.log('XMLHTTPrequest sends file to'+uploadUrl);
                xhr.send(fd);//no refresh 
        };



    }
]);



