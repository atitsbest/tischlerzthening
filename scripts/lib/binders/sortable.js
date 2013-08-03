ko.bindingHandlers.sortable = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
	var config = valueAccessor();
	if(!config) { return; }
					
	var allBindings = allBindingsAccessor();
	var array = allBindings.foreach || allBindings.template.foreach;
					
	var $list = jQuery(element);
	
	$list
	  .data('ko-sort-array', array)
	  .sortable(config)
	  .bind('sortstart', function (event, ui) {                  
		ui.item.data('ko-sort-array', array);
		ui.item.data('ko-sort-index', ui.item.index());
	  })
	  .bind('sortupdate', function (event, ui) {
		var $newList = ui.item.parent();
		if($newList[0] != $list[0]){ return; }
			
		var oldArray = ui.item.data('ko-sort-array');
		var oldIndex = ui.item.data('ko-sort-index');
			
		var newArray = $newList.data('ko-sort-array');
		var newIndex = ui.item.index();
		
		// Wenn nur innerhalb eines Arrays verschoben wird, 
		// behandel wir das separat, damit subscirbes bei 
		// einer Änderung nur 1x feuern.
		if (newArray === oldArray) {
		  var array = ko.toJS(newArray);
		  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
		  oldArray(array);
		}
		else {
		  var item = oldArray.splice(oldIndex, 1)[0];
		  newArray.splice(newIndex, 0, item);
		}
	  });
  }
};
