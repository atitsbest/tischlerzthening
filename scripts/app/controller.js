/**
 * Die Sitemap
 */
var sitemap = [
	{id:'home', children: [] },
	{id:'galerie', children: [
		{id:'bad'}, 
		{id:'wohnen'}, 
		{id:'schlafen'}, 
		{id:'aufkochen'}, 
		{id:'frischluft'}, 
		{id:'arbeiten'}, 
		{id:'stiegen'}, 
		{id:'tuer', name:'t&uuml;r'}
	]},
	{id:'team', children: [
		{id:'buero',name:'b&uuml;ro',left:true}, 
		{id:'werkstatt',left:true}
	]},
	{id:'leistungen', children: [
		{id:'tischlerei'}, 
		{id:'architektur'}, 
		{id:'hi-fi'}
	]},
	{id:'kontakt', children: [
		{id:'adresse'}, 
		{id:'anfahrtsplan'}
	]},
	{id:'geschichte', left:true, children: []}
]

/**
 * Hier wird das Verhalten des Haupt-Menüs programmiert.
 */
function Controller(/**hash*/sitemap) {
	var self = this;

	// => [{key:, value:}]
	self.sitemap = ko.observable(sitemap);

	// List mit den Ids aller Gallerien.
	self.galeryIds = ko.computed(function() {
		return _(
			_.chain(sitemap)
				.filter(function(s) { return s.id === 'galerie'})
				.first()
				.value()
				.children
		).pluck('id');
	});

	self.ROOT = 'home';

	self.selectedMainMenuId = ko.observable('');
	self.activeMainMenuId = ko.observable('');
	self.selectedSubMenuId = ko.observable('');

	// Momentan ausgewählter Haupt-Menüeintrag aus der Sitemap.
	self.activeMainMenu = ko.computed(function() {
		return _.find(self.sitemap(),
					  function(s) { return s.id == self.activeMainMenuId(); }) || {};
	});

	// Momentan ausgewählter Haupt-Menüeintrag aus der Sitemap.
	self.selectedSubMenu = ko.computed(function() {
		return _.find(self.activeMainMenu().children,
					  function(s) { return s.id == self.selectedSubMenuId(); }) || {};
	});

	// Die aktuell ausgewählten Submenus.
	self.submenu = ko.computed(function() {
		return self.activeMainMenu().children;
	});
	
	// Id des Templates auf der rechten Seite.
	self.rightTemplate = ko.computed(function() {
		return self.selectedMainMenuId() + '_' + self.selectedSubMenuId() + '_rightTemplate';
	})
	.extend({ throttle: 1 }); 	// INFO: Die Ids für MainMenu und SubMenu werden getrennt gesetzt. Throttle wartet
							  	// 		 ein bisschen, bis auch das Submenu gesetzt wurde. 

	// Id des Templates auf der rechten Seite.
	self.leftTemplate = ko.computed(function() {
		return self.selectedSubMenu().left || self.activeMainMenu().left
			? self.selectedMainMenuId() + '_' + self.selectedSubMenuId() + '_leftContentTemplate'
			: '__leftContentTemplate';
	})
	.extend({ throttle: 1 });	// INFO: siehe oben.

	// Routes:
	self.routes = Sammy(function() {
		this.get('#:main/', function() {
			self.selectedMainMenuId(this.params['main'] || self.ROOT)
			self.selectedSubMenuId('')
		});
		this.get('#:main/:sub', function() {
			if (_(self.activeMainMenuId()).isEmpty()) {
				self.activeMainMenuId(this.params['main'] || self.ROOT);
			}
			self.selectedMainMenuId(this.params['main'] || self.ROOT)
			self.selectedSubMenuId(this.params['sub'])
		});
	});
};

/**
 * Wird aufgerufen, wenn ein Haupt-Menu-Eintrag ausgewählt wurde.
 */
Controller.prototype.onMainMenuSelect = function(/**string*/id) {
	this.activeMainMenuId(id);
	// Gibt es kein Untermenü wird direkt auf diesen Eintrag directed.
	if (_(this.activeMainMenu().children).isEmpty()) {
		location.hash = '#' + id + '/';
	}
};

/** 
 * Seite in der (vertikalen) Mitte halten.
 */
function center() {
	$('#content').css('top', Math.max(20, parseInt(($(document).height() - $('#content').height())/2)));
}

var viewModel = new Controller(sitemap);

$(function() {
	center();
	$(window).resize(function() { center(); });

	if (_.isEmpty(location.hash)) {
		location.hash = '#' + viewModel.ROOT + '/';
	}

	viewModel.routes.run();
	ko.applyBindings(viewModel);	


  var navUpHandle, navDownHandle
  (function() {
    function scroll() {
      var $this = $(this);
      var $parent = $this.parent();
      var scrollTop = $parent.scrollTop();
      var newPos = $this.is('.nav-up') ? scrollTop-435 : scrollTop+435;
      $parent.animate({scrollTop : newPos}, 500, 'easeInOutCirc');
    }

    // Animation für Rauf-Runter
    $('.gallery > .nav')
      .live('click', scroll)
      .live('mouseover', function() { $(this).animate({'top': $(this).is('.nav-up') ? '-=10' : '+=10' }, 200); })
      .live('mouseout', function() { $(this).animate({'top': $(this).is('.nav-up') ? '+=10' : '-=10' }, 200); });

    // Animation für Links-Rechts
    $('.flex-direction-nav a.next')
      .live('mouseover', function() { $(this).animate({right: '-=10'}, 200); })
      .live('mouseout', function() { $(this).animate({right: '+=10'}, 200); });
    $('.flex-direction-nav a.prev')
      .live('mouseover', function() { $(this).animate({left: '-=10'}, 200); })
      .live('mouseout', function() { $(this).animate({left: '+=10'}, 200); });
  })();

})


