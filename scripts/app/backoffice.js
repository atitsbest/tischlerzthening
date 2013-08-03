/**
 * Die Sitemap
 */
var sitemap = [
	{id:'Allgemein', children: [
		{id:'Home'},
		{id:'Geschichte'}
	]},
	{id:'Galerie', children: [
		{id:'Bad'}, 
		{id:'Wohnen'}, 
		{id:'Schlafen'}, 
		{id:'Aufkochen'}, 
		{id:'Frischluft'}, 
		{id:'Arbeiten'}, 
		{id:'Stiegen'}, 
		{id:'Tuer', name:'T&uuml;r'}
	]},
	{id:'Team', children: [
		{id:'Werkstatt',left:true}
	]},
	{id:'Leistungen', children: [
		{id:'Architektur'}
	]},
]

/**
 * Repräsentiert einen Upload.
 * @class Upload
 */
function Upload(/**hash*/data) {
  _.extend(this, data);

  var self = this;

  self.remove = function() {
  	viewModel.removeUpload(self);
  }

}

/**
 * Hier wird das Verhalten des Haupt-Menüs programmiert.
 */
function Controller(/**hash*/sitemap) {
	var self = this;

	// => [{key:, value:}]
	self.sitemap = ko.observable(sitemap);

	self.uploads = ko.observableArray();

	self.ROOT = 'home';

	self.selectedTag = ko.observable('');

	// Liefert die Liste mit den gerade sichtbaren Bildern.
	self.visibleUploads = ko.observableArray(); 

	self.selectedTag.subscribe(function(){ self.refreshVisibleUploads(); });

	// Routes:
	self.routes = Sammy(function() {
		this.get('#:main/:sub', function() {
			self.selectedTag(location.hash);
		});
	});

	/**
	 * Wird aufgerufen, wenn ein Haupt-Menu-Eintrag ausgewählt wurde.
	 */
	self.onMainMenuSelect = function(/**string*/id) {
		self.activeMainMenuId(id);
		// Gibt es kein Untermenü wird direkt auf diesen Eintrag directed.
		if (_.isEmpty(self.activeMainMenu().children)) {
			location.hash = '#' + id + '/';
		}
	};

	/**
	 * Bildpositionen speichern.
	 */
	self.saveVisibleUploadsPosition = function() {
	  	var data = _(self.visibleUploads()).map(function(u, i) {return {id: u.id, pos: u.pos};});
	  	$.post('chef/uploads/arrange', {data: data})
	   		.error(function() { alert('Ups, beim Arrangieren der Bilder ist uns ein Fehler passiert.')});
	};

	/**
	 * Ändert die Liste der gerade sichtbaren Uploads.
	 * INFO: Dabei wird die Subscription zum Speichern der Upload-Positionen
	 *	 	 außer Kraft gesetzt.
	 */
	self.changeVisibleUploads = function(/**Array*/newvalue) {
		if (self.visibleUploadsSubscription != null) {
			self.visibleUploadsSubscription.dispose();
	  	}
	  	self.visibleUploads(newvalue);

	  	self.visibleUploadsSubscription = self.visibleUploads.subscribe(function() {
			// Positionen aktualisieren...
			_(self.visibleUploads()).each(function(u, i) { 
				// ...bei den sichtbaren Uploads...
				u.pos = i; 
				// ...und bei allen Uploads.
				_(self.uploads())
					.find(function(up) { return up.id == u.id; })
					.pos = i;
			});
			// Positionen auf dem Server speichern.
			self.saveVisibleUploadsPosition();
	  	});
	};

	/**
	 */
	self.refreshVisibleUploads = function() {
  		var data = _.chain(self.uploads())
  			.filter(function(u) { return u.tag == self.selectedTag(); })
  			.sortBy(function(u) { return u.pos; })
  			.value();
		self.changeVisibleUploads(data);
	};

	/**
	 * Das übergebene Upload aus der Lister der verfügbaren Uploads entfernen.
	 */
	self.removeUpload = function(/**Upload*/upload) {
		if (confirm('Bild wirklich löschen?')) {
			$.get('/chef/uploads/' + upload.id + '/remove')
				.success(function() {
					ko.utils.arrayRemoveItem(self.uploads(), upload);
					self.refreshVisibleUploads();
				})
				.error(function() {
					alert('Ups, beim Löschen ist ein Fehler passiert. Sorry.');
				});
		}

		return false;
	};

  /**
   * Änderungen an den Bildern auf anderen Webspace übertragen.
   */
  self.publish = function() {
    $.when($.post('/chef/uploads/publish')).then(function() {
      alert('Bilder veröffentlich.');
    })
    .fail(function() {
      alert('Beim Veröffentlichen ist ein Fehler passiert.');
    });
  };
};


