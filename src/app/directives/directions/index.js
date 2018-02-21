/* global google */

const directions = function(Attr2MapOptions, $timeout, NavigatorGeolocation, NgMap) {
    
    let requestTimeout, routeRequest;
    // Delay for each route render to accumulate all requests into a single one
    // This is required for simultaneous origin\waypoints\destination change
    // 20ms should be enough to merge all request data
    let routeRenderDelay = 20;
    
    const getDirectionsRenderer = function(options, events) {
        if (options.panel) {
          options.panel = document.getElementById(options.panel) ||
            document.querySelector(options.panel);
        }
    
        var renderer = new google.maps.DirectionsRenderer(options);
        for (var eventName in events) {
            google.maps.event.addListener(renderer, eventName, events[eventName]);
        }
        return renderer;
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
          var attrsToObserve = Attr2MapOptions.getAttrsToObserve(orgAttrs);
    
          var attrsToObserve = [];
          if (!filtered.noWatcher) {
              attrsToObserve = Attr2MapOptions.getAttrsToObserve(orgAttrs);
          }
    
          var renderer = getDirectionsRenderer(options, events);
          mapController.addObject('directionsRenderers', renderer);
    
          attrsToObserve.forEach(function(attrName) {
            (function(attrName) {
              attrs.$observe(attrName, function(val) {
                if (attrName == 'panel') {
                  $timeout(function(){
                    var panel =
                      document.getElementById(val) || document.querySelector(val);
                    console.log('setting ', attrName, 'with value', panel);
                    panel && renderer.setPanel(panel);
                  });
                } else if (options[attrName] !== val) { //apply only if changed
                  var optionValue = parser.toOptionValue(val, {key: attrName});
                  console.log('setting ', attrName, 'with value', optionValue);
                  options[attrName] = optionValue;
                  updateRoute(renderer, options);
                }
              });
            })(attrName);
          });
    
          NgMap.getMap().then(function() {
            updateRoute(renderer, options);
          });
          element.bind('$destroy', function() {
            mapController.deleteObject('directionsRenderers', renderer);
          });          
      }
    };    
};


directions.$inject = ['Attr2MapOptions', '$timeout', 'NavigatorGeolocation', 'NgMap'];

module.exports = directions;