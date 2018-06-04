/* global google */

const DynamiMapsEngineLayer = function(Attr2MapOptions) {
    function getDynamicsMapsEngineLayer(options, events) {
        let layer = new google.maps.visualization.DynamicMapsEngineLayer(options);
        
        for (var eventName in events) {
            google.maps.event.addListener(layer, eventName, events[eventName]);
        }
        
        return layer;
    }
    
    return {
        restrict: 'E',
        require: ['?^map', '?^ngMap'],
        link: function(scope, element, attrs, mapController) {
            mapController = mapController[0]||mapController[1];
            
            var filtered = Attr2MapOptions.filter(attrs);
            var options = Attr2MapOptions.getOptions(filtered, {scope: scope});
            var events = Attr2MapOptions.getEvents(scope, filtered, events);
            
            
            var layer = getDynamicsMapsEngineLayer(options, events);
            mapController.addObject('mapsEngineLayers', layer);
        }
    };
};

DynamiMapsEngineLayer.$inject = ['Attr2MapOptions'];

module.exports = DynamiMapsEngineLayer;