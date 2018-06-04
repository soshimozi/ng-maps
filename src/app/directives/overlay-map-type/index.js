const OverlayMapType = function(NgMap) {

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var initMethod = attrs.initMethod || "insertAt";
        var overlayMapTypeObject = scope[attrs.object];

        NgMap.getMap().then(function(map) {
          if (initMethod == "insertAt") {
            var index = parseInt(attrs.index, 10);
            map.overlayMapTypes.insertAt(index, overlayMapTypeObject);
          } else if (initMethod == "push") {
            map.overlayMapTypes.push(overlayMapTypeObject);
          }
        });
        mapController.addObject('overlayMapTypes', overlayMapTypeObject);
      }
     }; // return
  };
  
  OverlayMapType.$inject = ['NgMap'];
  module.exports = OverlayMapType;