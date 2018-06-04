/* global google */

const TransitLayer = function(Attr2MapOptions) {

    var getLayer = function(options, events) {
      var layer = new google.maps.TransitLayer(options);
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

        var orgAttrs = Attr2MapOptions.orgAttributes(element);
        var filtered = Attr2MapOptions.filter(attrs);
        var options = Attr2MapOptions.getOptions(filtered, {scope: scope});
        var events = Attr2MapOptions.getEvents(scope, filtered);
        console.log('transit-layer options', options, 'events', events);

        var layer = getLayer(options, events);
        mapController.addObject('transitLayers', layer);
        mapController.observeAttrSetObj(orgAttrs, attrs, layer);  //observers
        element.bind('$destroy', function() {
          mapController.deleteObject('transitLayers', layer);
        });
      }
     }; // return
  };
  
  TransitLayer.$inject = ['Attr2MapOptions'];
  module.exports = TransitLayer;