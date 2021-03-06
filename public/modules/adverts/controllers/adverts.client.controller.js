'use strict';

// Adverts controller
angular.module('adverts').controller('AdvertsController', ['$scope', '$stateParams', 
	'$location', 'Authentication', 'Adverts','AdvertsPID','$http','$','includeService', 'd3',
	function($scope, $stateParams, $location, Authentication, Adverts,AdvertsPID,$http,$,includeService,d3) {
	$scope.authentication = Authentication;
		$scope.init = function () {
			$scope.authentication = Authentication; 
			$scope.files          = [];//-->To store files  for uploading using Document.querySelectorAll()
			$scope.filesName      = [];//-->To store all uploaded files names
			$('#form :input').prop('disabled', true);//-->To disable by defaut all form elements inside 'form'
			$scope.showAdverts = {url:'modules/adverts/views/show-advert.client.view.html', 
								 visible:false};
		};



		//fonction: galery

		$scope.gallery= function () {

			$(document).on('mousemove','#galerie',function() {

			  var photos = document.getElementById('galerie_mini') ;
			  // On récupère l'élément ayant pour id galerie_mini
			  var liens = photos.getElementsByTagName('a') ;
			  // On récupère dans une variable tous les liens contenu dans galerie_mini
			  var big_photo = document.getElementById('big_pict') ;
			  // Ici c'est l'élément ayant pour id big_pict qui est récupéré, c'est notre photo en taille normale

			  var titre_photo = document.getElementById('photo').getElementsByTagName('dt')[0] ;

			  $('#galerie_mini').css('width',liens.length*110+'px');


			  // Et enfin le titre de la photo de taille normale
			  // Une boucle parcourant l'ensemble des liens contenu dans galerie_mini
			  for (var i = 0 ; i < liens.length ; ++i) {
			  	
			    // Au clique sur ces liens 
			    liens[i].onclick = function() {
			      big_photo.src = this.href; // On change l'attribut src de l'image en le remplaçant par la valeur du lien
			      big_photo.alt = this.title; // On change son titre
			      titre_photo.firstChild.nodeValue = this.title; // On change le texte de titre de la photo
			      return false; // Et pour finir on inhibe l'action réelle du lien
			    };
			  }
			});

		};


		$scope.EditAdvertMapActions = function () {


			//changer la couleur de la parcelle qui correspond à l'annonce choisie
			$('#FormUpdate').on('mouseover','.form-horizontal',function(e) {
					var pid = '#'+ $(this).find('.indice').text();
					$('.buildings').attr('class','hideAdvert');
					$(pid).attr('class','AdvertBlink');

			});

			//restaurer la couleur par défaut de la parcelle
			$('#FormUpdate').on('mouseout','.form-horizontal',function(e) {
					var pid = '#'+ $(this).find('.indice').text();
					$(pid).attr('class','buildings');
					$('.hideAdvert').attr('class','buildings');
			});
		};


		//Les actions du map liées à la liste des annonces 
		$scope.ListAdvertMapActions = function () {


			//changer la couleur de la parcelle qui correspond à l'annonce choisie
			$('#ListAdvert').on('mouseover','.jumbotron',function(e) {
					var pid = '#'+ $(this).find('.indice').text();
					$('.buildings').attr('class','hideAdvert');
					$(pid).attr('class','AdvertBlink');
			});

			//restaurer la couleur par défaut de la parcelle
			$('#ListAdvert').on('mouseout','.jumbotron',function(e) {
					var pid = '#'+ $(this).find('.indice').text();
					$(pid).attr('class','buildings');
					$('.hideAdvert').attr('class','buildings');
			});
		};



		//Les actions du map liées à la création d'une annonce
		$scope.CreateAdvertMapActions = function () {

		$('#contenu').on('click','.buildings',function(e) {
				$scope.selectedID_= $(this).attr('id');
				$scope.$apply();

				//hide alert "select a parcel"
				$('#AlerMap').hide();


	          	//Select to the database with the corresponding id and verify if 
	          	//it does not already be used
				$http.get('/adverts/pidroute/' + $(this).attr('id'))
				.success(function (advert) {
					$scope.showAdverts.visible = true;
					$('#form :input').prop('disabled', true);
					includeService.includeAdvert(advert);
				}).error(function (err) {//If this pid is not yet use for an another advert
					$scope.showAdverts.visible = false;
					$('#form :input').prop('disabled', false);					       	
				});

				// Prendre les coordoneés du curseur
				var left = e.clientX-10;
			    var top = e.clientY-40;

			    //ajouter un pointeur 
			    $('#ptr').remove();
			    $('#positionButtonDiv').append( '<p id ="ptr" ><img src="/modules/adverts/img/pointeur.png"/></p>');
		        $('#ptr').css('top',top);
		        $('#ptr').css('left',left);
		        
		        // ajustement de l'extrait de l'annonce selon la position de la parcelle
		        if (top>550){
		        	top=top-150;
		        }
		        if (left>900){
		        	left=left-320;
		        }
		        $('#advert').css('top',top);
		        $('#advert').css('left',left);

			});
		};



		$scope.zoom = function () {
			$(document).ready(function() {
				function moveButtonClickHandler(e){
					$('#ptr').remove();
			    	var pixelsToMoveOnX = 0;
					var pixelsToMoveOnY = 0;
			
					switch(e.target.id){
						case 'leftPositionMap':
							pixelsToMoveOnX = 50;	
						break;
						case 'rightPositionMap':
							pixelsToMoveOnX = -50;
						break;
						case 'topPositionMap':
							pixelsToMoveOnY = 50;	
						break;
						case 'bottomPositionMap':
							pixelsToMoveOnY = -50;	
						break;
					}
					$('#imgContainer').smartZoom('pan', pixelsToMoveOnX, pixelsToMoveOnY);
			    }

			    function zoomButtonClickHandler(e){
			    	$('#ptr').remove();
			    	var scaleToAdd = 1.2;
					if(e.target.id === 'zoomOutButton')
						scaleToAdd = -scaleToAdd;
					$('#imgContainer').smartZoom('zoom', scaleToAdd);
			    }
				$('#imgContainer').smartZoom({'containerClass':'zoomableContainer'});
				$('#topPositionMap,#leftPositionMap,#rightPositionMap,#bottomPositionMap').bind('click', moveButtonClickHandler);
  				$('#zoomInButton,#zoomOutButton').bind('click', zoomButtonClickHandler);
			});
		};


		// Create new Advert
		$scope.create = function() {
			var myid  = ($scope.selectedID_).replace('-','');
			//Temporary variable containing form informations
			var form  = {
					name: this.name,
					pid:myid,
					region:this.region,
					postcode:this.postcode,
					firstname:this.firstname,
					lastname:this.lastname,
					email:this.email,
					phone:this.phone,
					title:this.title,
					description:this.description,
					area: $scope.selectedArea_,
					price:this.price
			    };
			//Returns a list of the elements within the document 
			//which have image css class
			var imgs  = document.querySelectorAll('.image');
			var count = 0;//
			//Send all files before to store the advert
            for (var i= 0; i<imgs.length; i++) 
            {
	           	var fd = new FormData();
	           	fd.append('file',imgs[i].file);
				$http.post('/adverts/upload', fd,{
	                transformRequest: angular.identity,
	                headers: {'Content-Type': undefined}
	            }).
				  success(function(filesname) {
				  	//files are stored and renamed by the controller server side
				  	//we recieve each name of stored file and push it in fileName array
				  	$scope.filesName.push({photo:filesname.photo});
				  		if(count == imgs.length-1){
						var advert = new Adverts ({
							pid:form.pid,
							region:form.region,
							postcode:form.postcode,
							firstname:form.firstname,
							lastname:form.lastname,
							email:form.email,
							phone:form.phone,
							title:form.title,
							description:form.description,
							area: form.area,
							price:form.price,
							photo:$scope.filesName
						});
						// Redirect after save
						advert.$save(function(response) {
							$location.path('adverts/' + response._id);
							// Clear form fields
							$scope.name = '';
						}, function(errorResponse) {
							$scope.error = errorResponse.data.message;
						});	 }
						count++;
				  }).
				  error(function(err) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				  });
			}//END for
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

	    // Find existing Realestate by the pid
		$scope.findAdvertByPID = function(response) {
			console.log('findAdvertByPID');
			$scope.data = response;
			$scope.advert = AdvertsPID.get({ 
				advertPID: response.pid
			});
		};

		//Load files uploaded from the brower
		//As the drag-and-drop operation (or the input[type=file]) contains a file object
		$scope.dragandrop = function () {
			function dragenter(e) {
			  e.stopPropagation();
			  e.preventDefault();
			}

			function dragover(e) {
			  e.stopPropagation();
			  e.preventDefault();
			}

			function drop(evt) {
			  evt.stopPropagation();
			  evt.preventDefault();
			  handleFileSelect(evt);
			}//END drop

			var dropbox = document.getElementById('dropbox');
			dropbox.addEventListener('dragenter', dragenter, false);
			dropbox.addEventListener('dragover', dragover, false);
			dropbox.addEventListener('drop', drop, false); 
		};//END Darg and drop

		$scope.loadFilesFromInput = function() {
		  var dropbox=document.getElementById('files');
		  dropbox.addEventListener('change', handleFileSelect, false);
		};

		function handleFileSelect(evt) { 
			//handle from input or from drag and drop
		      var files = evt.target.files || evt.dataTransfer.files;
			  for (var i = 0,file=files[i]; i < files.length; i++) {
			    var imageType = /image.*/;
			    if (!file.type.match(imageType)) {continue;}
			    $scope.files.push(file);//-->Files will be sent while creating new advert		    
			    //Add new image element in the ouput
			    var img = document.createElement('img'),
			    preview = document.getElementById('list');
			    img.classList.add('image');
			    img.file = file;
			    preview.appendChild(img); //Assuming that 'preview' is a the div output where the content will be displayed.
			    
			    var reader = new FileReader();
				//Closure to capture the file information.
				reader.onload = (function(aImg) {
					return function(e) {aImg.src = e.target.result;
						//$scope.files.push(e.target.result);//-->stored files using binary format
					};})(img);
		        reader.readAsDataURL(file);
			  }//END FOR
		 }//END handleFileSelect

	}
]);