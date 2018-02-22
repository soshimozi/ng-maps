/* global google */

const MapsEngineLayer = function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getMapsEngineLayer = function(options, events) {
      var layer = new google.maps.visualization.MapsEngineLayer(options);

      for (var eventName in events) {
        google.maps.event.addListener(layer, eventName, events[eventName]);
      }

      return layer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered, events);
        console.log('maps-engine-layer options', options, 'events', events);

        var layer = getMapsEngineLayer(options, events);
        mapController.addObject('mapsEngineLayers', layer);
      }
     }; // return
  };
  
  
  MapsEngineLayer.$inject = ['Attr2MapOptions'];
  
  module.exports = MapsEngineLayer;