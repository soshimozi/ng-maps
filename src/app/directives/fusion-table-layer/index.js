/* global google */

const FusionTablesLayer = function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getLayer = function(options, events) {
      var layer = new google.maps.FusionTablesLayer(options);

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
        console.log('fusion-tables-layer options', options, 'events', events);

        var layer = getLayer(options, events);
        mapController.addObject('fusionTablesLayers', layer);
        element.bind('$destroy', function() {
          mapController.deleteObject('fusionTablesLayers', layer);
        });
      }
     }; // return
  };
  
  
  FusionTablesLayer.$inject = ['Attr2MapOptions'];
  module.exports = FusionTablesLayer;