################################################
#Real Estate WebApp    			               #
#					                           #
# @Auteurs       : 			                   #
#		  -->Issa ABDRASSOUL-YOUSSOUF          #
#		  -->Yaser BOUHAFS	                   #
# @Date          : 04/01/2015                  #
################################################

Note that to download the project you have just to execute realestate.sh script  (bash realestate.sh)

The reale state project is consisting to create a webapp called realestate
for managing building adverts using MEAN JS and the following tchnologies :

    -->Framework Web with Express and Node ;
    -->CSS Preprocessing using SASS ;
    -->NoSQL database with MongoDB ;
    -->ORM (Object Representational Model) using Mongoose ;
    -->Client-side MVC (Model View Controller) using AngularJS ;
    -->Use of bower and npm to manage package and dependencies client side for server side respectively;
    -->Unit tests sing Mocha, Jasmine;
    -->Grunt for the differents task ;
    -->Scaffolding using Yeoman.

Using this API it is possible to create, remove, update and visualize adverts.
The important fonctionalities we have developped hardly are located in:
app/
├── controllers
│   ├── adverts.server.controller.js -->>>>>>(-->advertByPID(find advert by the building id) and -->fileUpload(store photos) functions)
│   
├── models
│   ├── advert.server.model.js
│   
├── routes
│   ├── adverts.server.routes.js -->>>>>>(-->app.route('/adverts/pidroute/:advertPID') and --> app.route('/adverts/upload'))

config/
├── config.js
├── env
│   ├── all.js  -->>>>>>(we have imported some important modules: d3, jquery...)

public/
├── modules
│   ├── adverts
│   │   ├── adverts.client.module.js
│   │   ├── config
│   │   │   ├── adverts.client.config.js
│   │   ├── controllers
│   │   │   └── adverts.client.controller.js -->>>>>>(Functions ::: dragandrop, loadFilesFromInput,handleFileSelect,findAdvertByPID,create, 						              zoom,CreateAdvertMapActions,ListAdvertMapActions,EditAdvertMapActions,gallery)
│   │   ├── css
│   │   │   └── shapes.css
│   │   ├── data
│   │   │   ├── data.json
│   │   ├── directives
│   │   │   └── adverts.client.directive.js -->>>>>>(we have created it developped it full fonctionalities )
│   │   ├── img
│   │   │   ├── users	(Contain users photos)
│   │   ├── js, 
│   │   │   ├── includes.js -->>>>>>(Services containing useful functions: includeAdvert sendHTTPPOSTFile, sendXMLHTTPFile)
│   │   │   ├── shapes.js
│   │   │   └── ZoomLib.js
│   │   ├── services
│   │   │   └── adverts.client.service.js -->>>>>>(we have included some important modules)
│   │   └── views
│   ├── core
│   │   └── views

Notes : It was very interresting because we have learnt important things such as the using of angular js, express, node js, Mongodb.
We have been able to improve in :
	-->how to generate unique identifiers in Node js, 
	-->how to use multiparty module top arse http requests with content-type multipart/form-data
	-->how to use fs module to store,move and remove photos
	-->how File HTML5 API to interact with local files, make drag and drop

