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
  
    const updateRoute = function(renderer, options) {
      var directionsService = new google.maps.DirectionsService();
    
      /* filter out valid keys only for DirectionsRequest object*/
      var request = options;
      request.travelMode = request.travelMode || 'DRIVING';
      var validKeys = [
        'origin', 'destination', 'travelMode', 'transitOptions', 'unitSystem',
        'durationInTraffic', 'waypoints', 'optimizeWaypoints', 
        'provideRouteAlternatives', 'avoidHighways', 'avoidTolls', 'region'
      ];
      if (request) {
        for(var key in request) {
          if (request.hasOwnProperty(key)) {
            (validKeys.indexOf(key) === -1) && (delete request[key]);
          }
        }
      }
    
      if(request.waypoints) {
        // Check for acceptable values
        if(!Array.isArray(request.waypoints)) {
          delete request.waypoints;
        }
      }
    
      var showDirections = function(request) {
        if (requestTimeout && request) {
          if (!routeRequest) {
            routeRequest = request;
          } else {
            for (var attr in request) {
              if (request.hasOwnProperty(attr)) {
                routeRequest[attr] = request[attr];
              }
            }
          }
        } else {
          requestTimeout = $timeout(function() {
            if (!routeRequest) {
              routeRequest = request;
            }
            directionsService.route(routeRequest, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                renderer.setDirections(response);
                // Unset request for the next call
                routeRequest = undefined;
              }
            });
            $timeout.cancel(requestTimeout);
            // Unset expired timeout for the next call
            requestTimeout = undefined;
          }, routeRenderDelay);
        }
      };
    
      if (request && request.origin && request.destination) {
        if (request.origin == 'current-location') {
          NavigatorGeolocation.getCurrentPosition().then(function(ll) {
            request.origin = new google.maps.LatLng(ll.coords.latitude, ll.coords.longitude);
            showDirections(request);
          });
        } else if (request.destination == 'current-location') {
          NavigatorGeolocation.getCurrentPosition().then(function(ll) {
            request.destination = new google.maps.LatLng(ll.coords.latitude, ll.coords.longitude);
            showDirections(request);
          });
        } else {
          showDirections(request);
        }
      }
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
          //var attrsToObserve = Attr2MapOptions.getAttrsToObserve(orgAttrs);
    
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
                  var optionValue = Attr2MapOptions.toOptionValue(val, {key: attrName});
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