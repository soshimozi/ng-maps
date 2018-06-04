/* global google */

const customControl = function(Attr2MapOptions, NgMap)  {

    return {
        restrict: 'E',
        require: ['?^map','?^ngMap'],
        transclude: true,
        link: function(scope, element, attrs, mapController, $transclude) {
            mapController = mapController[0]||mapController[1];
            var filtered = Attr2MapOptions.filter(attrs);
            var options = Attr2MapOptions.getOptions(filtered, {scope: scope});
            var events = Attr2MapOptions.getEvents(scope, filtered);
            var innerScope = scope.$new();
    
            /**
             * build a custom control element
             */
            var customControlEl = element[0].parentElement.removeChild(element[0]);
            var content = $transclude( innerScope, function( clone ) {
              element.empty();
              element.append( clone );
              element.on( '$destroy', function() {
                innerScope.$destroy();
              });
            });
    
    
            /**
            * set events
            */
            for (var eventName in events) {
                google.maps.event.addDomListener(customControlEl, eventName, events[eventName]);
            }
    
            mapController.addObject('customControls', customControlEl);
            var position = options.position;
            mapController.map.controls[google.maps.ControlPosition[position]].push(customControlEl);
    
            element.bind('$destroy', function() {
                mapController.deleteObject('customControls', customControlEl);
            });
        }
    };
}
  
customControl.$inject = ['Attr2MapOptions', 'NgMap'];

module.exports = customControl;