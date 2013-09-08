/**
 * Flexslider per KnockoutJS starten.
 */
ko.bindingHandlers.flexslider = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var $element = $(element);
      var loader = new PxLoader();
      var $progress = $('<h1 style="color:#d8d8d8;font-size:3.1em;margin:200px 180px 0px;letter-spacing:-2px;position:absolute;"></h1>')
				.appendTo($element)
				.text('0 / ' + valueAccessor().length);
      _.each(valueAccessor(), function(url) { loader.addImage(url); }); 

      function initGalerie() {
        //init logic 
        var slider = $element
          .addClass('flexslider')
          .flexslider({
              animation: 'slide', 
              controlsContainer: '.item.right',
              slideshowSpeed: 4567,
              animationDuration: 600,
          });
      }
 
      // callback that will be run once images are ready 
      loader.addCompletionListener(function() {
        $progress.fadeOut(function() {
          $progress.remove(); 
          var $ul = $('<ul class="slides"></ul>').appendTo($element);
          ko.applyBindingsToNode($ul[0], {
            template: { 
              name: 'image_slider_Template', 
              foreach: valueAccessor()
            }
          });
          initGalerie();
        });
      }); 
      
      loader.addProgressListener(function(e) { 
        // the event provides stats on the number of completed items 
        $progress.text(e.completedCount + ' / ' + e.totalCount); 
      });     
  
      // begin downloading images 
      loader.start(); 
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
       //update logic
    } 
};

/**
 * Googlemap
 */
ko.bindingHandlers.googlemap = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      //init logic 
      var $element = $(element);
      $element
        .css("height", "100%")
        .css("width", "100%");

      var pos = new google.maps.LatLng(48.25529, 14.16889);
      var options = {
        zoom: 13,
        center: pos, 
        mapTypeId: google.maps.MapTypeId.HYBRID
      };
      var map = new google.maps.Map(element, options);
      var marker = new google.maps.Marker({ position: pos, map: map });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
       //update logic
    } 
};

/**
 * Flexslider Gallerie.
 */
ko.bindingHandlers.gallery = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var $element = $(element);
      var loader = new PxLoader();
      var $progress = $('<h1 style="color:#d8d8d8;font-size:3.1em;text-align:center;margin-top:200px;letter-spacing:-2px;"></h1>')
				.appendTo($element)
				.text('0 / ' + valueAccessor().length);
      _.each(valueAccessor(), function(obj) { loader.addImage(obj.url); }); 

      function initGalerieAsync() {
        // init logic 
        setTimeout(function() {
          // Click für die einzelnen Thumbnails registrieren.
          $element.find('li > img').each(function(index, img) {
            $(img)
              .css('cursor', 'pointer')
              .click(function() { 
                var $clone = $element.clone().hide();
                  $element.after($clone);
                  $clone
                  .hide()
                  .attr('class', 'flexslider')
                  .find('ul')
                    .addClass('slides')
                    .find('li > img').click(function() { 
                      $clone.remove();
                      $('.flex-control-nav, .flex-direction-nav').fadeOut('fast', function() { $(this).remove(); });
                      $element.show();
                      // Base-Url aus dem Pfadnamen entfernen. Dazu verwenden wir einen <a> als Parser (p).
                      var p = document.createElement('a');
                      p.href = this.src;
                      var src = p.pathname.substring(1);
                      // Das zuletzt angezeigte Bild in der Gallerie anzeigen.
                      $('img[src="'+src+'"]').scrollIntoView({ duration: 1000 });
                    })
                    .end()
                  .end()
                    .flexslider({
                      animation: 'slide', 
                      slideshow: false, 
                      controlsContainer: '.item.right', 
                      animationDuration: 450,
                      slideToStart: index,
                      start: function(slider) {
                        // Navigation bei vielen Bildern weiter nach unten setzen.
                        var diff = parseInt(slider.count / 26) * 19;
                        $clone.next('.flex-control-nav').css('bottom', slider.count > 25 ? (-33 - diff) + 'px' : '-33px');
                      }
                    });

                $element.hide();
                $clone.show();
            });
          });
        }, 100);
      }
 
      // callback that will be run once images are ready 
      loader.addCompletionListener(function() {
        $progress.fadeOut(function() {
          $progress.remove(); 
          // Scrollen wenn nötig...
          if (valueAccessor().length > 9) {
            $('<div class="nav nav-up"></div><div class="nav nav-down"></div>').appendTo($element);
          }
          var $ul = $('<ul></ul>').appendTo($element);
          ko.applyBindingsToNode($ul[0], {template: { name: 'image_galerie_Template', foreach: valueAccessor() }});
          initGalerieAsync();
          // Scrollbars a la Mac OS X Lion anzeigen.
          var mousewheelEventName = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
          $element
              .unbind('mousewheel')
              .bind('mousewheel', function(e, delta) {
                  e.preventDefault();
                  var scrollTop = $(this).scrollTop();
                  $(this).scrollTop(scrollTop-Math.round(delta)*8);
              });

        });
      }); 
      
      loader.addProgressListener(function(e) { 
        // the event provides stats on the number of completed items 
        $progress.text(e.completedCount + ' / ' + e.totalCount); 
      });     
  
      // begin downloading images 
      loader.start(); 
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
       //update logic
    } 
};
