/* global google */

const marker = function(Attr2MapOptions, $parse, NgMap) {
    
    var getMarker = function(options, events) {
        var marker;
        
        if (NgMap.defaultOptions.marker) {
          for (var key in NgMap.defaultOptions.marker) {
            if (typeof options[key] == 'undefined') {
              console.log('setting default marker options', 
                key, NgMap.defaultOptions.marker);
              options[key] = NgMap.defaultOptions.marker[key];
            }
          }
        }
        
        if (!(options.position instanceof google.maps.LatLng)) {
          options.position = new google.maps.LatLng(0,0);
        }
        marker = new google.maps.Marker(options);
        
        /**
         * set events
         */
        if (Object.keys(events).length > 0) {
        console.log("markerEvents", events);
        }
        
        for (var eventName in events) {
          if (eventName) {
            google.maps.event.addListener(marker, eventName, events[eventName]);
          }
        }
    
        return marker;
    };    

    return {
        restrict: 'E',
        require: ['?^map', '?^ngMap'],
        link: function(scope, element, attrs, mapController) {
            mapController = mapController[0]||mapController[1];
            
            var orgAttrs = Attr2MapOptions.orgAttributes(element);
            var filtered = Attr2MapOptions.filter(attrs);
            var markerOptions = Attr2MapOptions.getOptions(filtered, scope, {scope: scope});
            var markerEvents = Attr2MapOptions.getEvents(scope, filtered);
            console.log('marker options', markerOptions, 'events', markerEvents);
            
            var address;
            if (!(markerOptions.position instanceof google.maps.LatLng)) {
              address = markerOptions.position;
            }
            var marker = getMarker(markerOptions, markerEvents);
            mapController.addObject('markers', marker);
            if (address) {
              NgMap.getGeoLocation(address).then(function(latlng) {
                marker.setPosition(latlng);
                markerOptions.centered && marker.map.setCenter(latlng);
                var geoCallback = attrs.geoCallback;
                geoCallback && $parse(geoCallback)(scope);
              });
            }
            
            //set observers
            mapController.observeAttrSetObj(orgAttrs, attrs, marker); /* observers */
            
            element.bind('$destroy', function() {
              mapController.deleteObject('markers', marker);
            });            
        }
    };
};


marker.$inject = ['Attr2MapOptions', '$parse', 'NgMap'];

module.exports = marker;