'use strict';

app.module('adverts')
.service('IncludeService', ['$http','$',
    function($http,$) {
       var docs=100;
 
        //Getter pour la variable userData
        this.getDocs = function() {
            return docs;
        };
    }
]);



