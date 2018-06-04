/* global google */

const HeatMapLayer = function(Attr2MapOptions, $window) {
    var parser = Attr2MapOptions;
    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);

        /**
         * set options
         */
        var options = parser.getOptions(filtered, {scope: scope});
        options.data = $window[attrs.data] || parseScope(attrs.data, scope);
        if (options.data instanceof Array) {
          options.data = new google.maps.MVCArray(options.data);
        } else {
          throw "invalid heatmap data";
        }
        var layer = new google.maps.visualization.HeatmapLayer(options);
        
         
        console.log('layer', layer);
        


        /**
         * set events
         */
        var events = parser.getEvents(scope, filtered);
        console.log('heatmap-layer options', layer, 'events', events);

        mapController.addObject('heatmapLayers', layer);
        
        //helper get nexted path
        function parseScope( path, obj ) {
            return path.split('.').reduce( function( prev, curr ) {
                return prev[curr];
            }, obj || this );
        }
      }
     }; // return
  }
  
  
  HeatMapLayer.$inject = ['Attr2MapOptions', '$window'];
  
  module.exports = HeatMapLayer;