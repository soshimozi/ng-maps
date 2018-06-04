const MapData = function(Attr2MapOptions, NgMap) {
    var parser = Attr2MapOptions;
    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0] || mapController[1];
        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered, events);

        console.log('map-data options', options);
        NgMap.getMap(mapController.map.id).then(function(map) {
          //options
          for (var key in options) {
            var val = options[key];
            if (typeof scope[val] === "function") {
              map.data[key](scope[val]);
            } else {
              map.data[key](val);
            }
          }

          //events
          for (var eventName in events) {
            map.data.addListener(eventName, events[eventName]);
          }
        });
      }
     }; // return
  };
  
  
  
  MapData.$inject = ['Attr2MapOptions', 'NgMap'];
  module.exports = MapData;