/* global google */

const angular = require('angular');

import CustomMarker2 from './custom-marker.js';
    
'use strict';
var parser, $timeout, $compile, NgMap;


var linkFunc = function(orgHtml, varsToWatch) {
  //console.log('orgHtml', orgHtml, 'varsToWatch', varsToWatch);

  return function(scope, element, attrs, mapController) {
    mapController = mapController[0]||mapController[1];
    var orgAttrs = parser.orgAttributes(element);

    var filtered = parser.filter(attrs);
    var options = parser.getOptions(filtered, {scope: scope});
    var events = parser.getEvents(scope, filtered);

    /**
     * build a custom marker element
     */
    element[0].style.display = 'none';
    console.log("custom-marker options", options);
    var customMarker = new CustomMarker2(scope, parser, $compile, $timeout, options);

    // Do we really need a timeout with $scope.$apply() here?
    setTimeout(function() { //apply contents, class, and location after it is compiled

      scope.$watch('[' + varsToWatch.join(',') + ']', function(newVal, oldVal) {
        customMarker.setContent(orgHtml, scope);
      }, true);

      customMarker.setContent(element[0].innerHTML, scope);
      var classNames =
        (element[0].firstElementChild) && (element[0].firstElementChild.className || '');
      customMarker.class && (classNames += " " + customMarker.class);
      customMarker.addClass('custom-marker');
      classNames && customMarker.addClass(classNames);
      console.log('customMarker', customMarker, 'classNames', classNames);

      if (!(options.position instanceof google.maps.LatLng)) {
        NgMap.getGeoLocation(options.position).then(
          function(latlng) {
            customMarker.setPosition(latlng);
          }
        );
      }

    });

    console.log("custom-marker events", events);
    for (var eventName in events) { /* jshint ignore:line */
      google.maps.event.addDomListener(
        customMarker.el, eventName, events[eventName]);
    }
    mapController.addObject('customMarkers', customMarker);

    //set observers
    mapController.observeAttrSetObj(orgAttrs, attrs, customMarker);

    element.bind('$destroy', function() {
      //Is it required to remove event listeners when DOM is removed?
      mapController.deleteObject('customMarkers', customMarker);
    });

  }; // linkFunc
};


var customMarkerDirective = function(
    _$timeout_, _$compile_, $interpolate, Attr2MapOptions, _NgMap_, escapeRegExp
  )  {
  parser = Attr2MapOptions;
  $timeout = _$timeout_;
  $compile = _$compile_;
  NgMap = _NgMap_;

  var exprStartSymbol = $interpolate.startSymbol();
  var exprEndSymbol = $interpolate.endSymbol();
  var exprRegExp = new RegExp(escapeRegExp(exprStartSymbol) + '([^' + exprEndSymbol.substring(0, 1) + ']+)' + escapeRegExp(exprEndSymbol), 'g');

  return {
    restrict: 'E',
    require: ['?^map','?^ngMap'],
    compile: function(element) {
      console.log('el', element);
      element[0].style.display ='none';
      var orgHtml = element.html();
      var matches = orgHtml.match(exprRegExp);
      var varsToWatch = [];
      //filter out that contains '::', 'this.'
      (matches || []).forEach(function(match) {
        var toWatch = match.replace(exprStartSymbol,'').replace(exprEndSymbol,'');
        if (match.indexOf('::') == -1 &&
          match.indexOf('this.') == -1 &&
          varsToWatch.indexOf(toWatch) == -1) {
          varsToWatch.push(match.replace(exprStartSymbol,'').replace(exprEndSymbol,''));
        }
      });

      return linkFunc(orgHtml, varsToWatch);
    }
  }; // return
};// function

customMarkerDirective.$inject =
  ['$timeout', '$compile', '$interpolate', 'Attr2MapOptions', 'NgMap', 'escapeRegExpFilter'];
  
module.exports = customMarkerDirective;