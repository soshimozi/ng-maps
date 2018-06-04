/* global google */

const Shape = function(Attr2MapOptions, $parse, NgMap) {
    
    function getShape(options, events) {
        var shape;
        
        var shapeName = options.name;
        delete options.name;  //remove name bcoz it's not for options
        console.log("shape", shapeName, "options", options, 'events', events);
        
        /**
         * set options
         */
        switch(shapeName) {
          case "circle":
            if (!(options.center instanceof google.maps.LatLng)) {
              options.center = new google.maps.LatLng(0,0);
            } 
            shape = new google.maps.Circle(options);
            break;
          case "polygon":
            shape = new google.maps.Polygon(options);
            break;
          case "polyline":
            shape = new google.maps.Polyline(options);
            break;
          case "rectangle":
            shape = new google.maps.Rectangle(options);
            break;
          case "groundOverlay":
          case "image":
            var url = options.url;
            var opts = {opacity: options.opacity, clickable: options.clickable, id:options.id};
            shape = new google.maps.GroundOverlay(url, options.bounds, opts);
            break;
        }
        
        /**
         * set events
         */
        for (var eventName in events) {
          if (events[eventName]) {
            google.maps.event.addListener(shape, eventName, events[eventName]);
          }
        }
        return shape;
    }
  
  
    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: function(scope, element, attrs, mapController) {
          mapController = mapController[0]||mapController[1];
    
          var orgAttrs = Attr2MapOptions.orgAttributes(element);
          var filtered = Attr2MapOptions.filter(attrs);
          var shapeOptions = Attr2MapOptions.getOptions(filtered, {scope: scope});
          var shapeEvents = Attr2MapOptions.getEvents(scope, filtered);
    
          var address, shapeType;
          shapeType = shapeOptions.name;
          if (!(shapeOptions.center instanceof google.maps.LatLng)) {
            address = shapeOptions.center;
          }
          var shape = getShape(shapeOptions, shapeEvents);
          mapController.addObject('shapes', shape);
    
          if (address && shapeType == 'circle') {
            NgMap.getGeoLocation(address).then(function(latlng) {
              shape.setCenter(latlng);
              shape.centered && shape.map.setCenter(latlng);
              var geoCallback = attrs.geoCallback;
              geoCallback && $parse(geoCallback)(scope);
            });
          }
    
          //set observers
          mapController.observeAttrSetObj(orgAttrs, attrs, shape);
          element.bind('$destroy', function() {
            mapController.deleteObject('shapes', shape);
          });
        }
     }; // return  
};


Shape.$inject = ['Attr2MapOptions', '$parse', 'NgMap'];
module.exports = Shape;