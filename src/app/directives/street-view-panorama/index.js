/* global google */

const angular = require('angular');

const StreetViewPanorama = function(Attr2MapOptions, NgMap) {

    function getStreetViewPanorama(map, options, events) {
      var svp, container;
      if (options.container) {
        container = document.getElementById(options.container);
        container = container || document.querySelector(options.container);
      }
      if (container) {
        svp = new google.maps.StreetViewPanorama(container, options);
      } else {
        svp = map.getStreetView();
        svp.setOptions(options);
      }

      for (var eventName in events) {
        eventName &&
          google.maps.event.addListener(svp, eventName, events[eventName]);
      }
      return svp;
    }

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link:  function(scope, element, attrs) {
          var filtered = Attr2MapOptions.filter(attrs);
          var options = Attr2MapOptions.getOptions(filtered, {scope: scope});
          var controlOptions = Attr2MapOptions.getControlOptions(filtered);
          var svpOptions = angular.extend(options, controlOptions);
    
          var svpEvents = Attr2MapOptions.getEvents(scope, filtered);
          console.log('street-view-panorama',
            'options', svpOptions, 'events', svpEvents);
    
          NgMap.getMap().then(function(map) {
            var svp = getStreetViewPanorama(map, svpOptions, svpEvents);
    
            map.setStreetView(svp);
            (!svp.getPosition()) && svp.setPosition(map.getCenter());
            google.maps.event.addListener(svp, 'position_changed', function() {
              if (svp.getPosition() !== map.getCenter()) {
                map.setCenter(svp.getPosition());
              }
            });
            //needed for geo-callback
            var listener =
              google.maps.event.addListener(map, 'center_changed', function() {
                svp.setPosition(map.getCenter());
                google.maps.event.removeListener(listener);
              });
        });
    }

  };
  
};


StreetViewPanorama.$inject = ['Attr2MapOptions', 'NgMap'];

module.exports = StreetViewPanorama;