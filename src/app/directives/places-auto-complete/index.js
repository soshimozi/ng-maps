/* global google */

const PlacesAutoComplete = function(Attr2MapOptions, $timeout) {

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
          
          if (attrs.placesAutoComplete ==='false') {
            return false;
          }
          var filtered = Attr2MapOptions.filter(attrs);
          var options = Attr2MapOptions.getOptions(filtered, {scope: scope});
          var events = Attr2MapOptions.getEvents(scope, filtered);
          var autocomplete = new google.maps.places.Autocomplete(element[0], options);
          autocomplete.setOptions({strictBounds: options.strictBounds === true});
          for (var eventName in events) {
            google.maps.event.addListener(autocomplete, eventName, events[eventName]);
          }
    
          var updateModel = function() {
            $timeout(function(){
              ngModelCtrl && ngModelCtrl.$setViewValue(element.val());
            },100);
          };
          google.maps.event.addListener(autocomplete, 'place_changed', updateModel);
          element[0].addEventListener('change', updateModel);
    
          attrs.$observe('rectBounds', function(val) {
            if (val) {
              var bounds = Attr2MapOptions.toOptionValue(val, {key: 'rectBounds'});
              autocomplete.setBounds(new google.maps.LatLngBounds(
                new google.maps.LatLng(bounds.south_west.lat, bounds.south_west.lng),
                new google.maps.LatLng(bounds.north_east.lat, bounds.north_east.lng)));
              }
          });
    
          attrs.$observe('circleBounds', function(val) {
            if (val) {
              var bounds = Attr2MapOptions.toOptionValue(val, {key: 'circleBounds'});
              var circle = new google.maps.Circle(bounds);
              autocomplete.setBounds(circle.getBounds());
            }
          });
    
          attrs.$observe('types', function(val) {
            if (val) {
              var optionValue = Attr2MapOptions.toOptionValue(val, {key: 'types'});
              autocomplete.setTypes(optionValue);
            }
          });
    
          attrs.$observe('componentRestrictions', function (val) {
            if (val) {
              autocomplete.setComponentRestrictions(scope.$eval(val));
            }
          });
        }
    };
  };


PlacesAutoComplete.$inject = ['Attr2MapOptions', '$timeout'];
module.exports = PlacesAutoComplete;