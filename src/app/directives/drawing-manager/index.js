/* global google */

const DrawingManagerDirective = function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var controlOptions = parser.getControlOptions(filtered);
        var events = parser.getEvents(scope, filtered);

        /**
         * set options
         */
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: options.drawingmode,
          drawingControl: options.drawingcontrol,
          drawingControlOptions: controlOptions.drawingControlOptions,
          circleOptions:options.circleoptions,
          markerOptions:options.markeroptions,
          polygonOptions:options.polygonoptions,
          polylineOptions:options.polylineoptions,
          rectangleOptions:options.rectangleoptions
        });

        //Observers
        attrs.$observe('drawingControlOptions', function (newValue) {
          drawingManager.drawingControlOptions = parser.getControlOptions({drawingControlOptions: newValue}).drawingControlOptions;
          drawingManager.setDrawingMode(null);
          drawingManager.setMap(mapController.map);
        });


        /**
         * set events
         */
        for (var eventName in events) {
          google.maps.event.addListener(drawingManager, eventName, events[eventName]);
        }

        mapController.addObject('mapDrawingManager', drawingManager);

        element.bind('$destroy', function() {
          mapController.deleteObject('mapDrawingManager', drawingManager);
        });
      }
    }; // return
  };
  
  
  DrawingManagerDirective.$inject = ['Attr2MapOptions'];
  
  module.exports = DrawingManagerDirective;