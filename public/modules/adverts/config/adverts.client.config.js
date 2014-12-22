'use strict';

// Configuring the Articles module
angular.module('adverts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*Menus.addMenuItem('topbar', 'Adverts', 'adverts', 'dropdown', '/adverts(/create)?');
		Menus.addSubMenuItem('topbar', 'adverts', 'List Adverts', 'adverts');
		Menus.addSubMenuItem('topbar', 'adverts', 'New Advert', 'adverts/create');
		*/

		Menus.addMenuItem('topbar', 'New advert', 'adverts/create', 'item', '/adverts/create');
        Menus.addMenuItem('topbar', 'List adverts', 'adverts', 'item', '/adverts');

	}
]);