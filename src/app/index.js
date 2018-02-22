const angular = require('angular');

require('angular-ui-bootstrap');
require('jquery/dist/jquery');
//require('ngmap/build/scripts/ng-map.js');

//import '../../node_modules/ngmap/build/scripts/ng-map.js'

import '../../node_modules/bootstrap/dist/css/bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme';
import '../../node_modules/font-awesome/css/font-awesome.css';


const app = angular.module('ng-maps-app', ['ui.bootstrap']);


// import controllers and register

import HomeController from './controllers/HomeController';
app.controller('HomeController', HomeController);

import __MapController from './controllers/map-controller';
app.controller('__MapController', __MapController);

// filters
app.filter('camelCase', require('./filters/camel-case'));
app.filter('escapeRegExp', require('./filters/escape-regexp'));
app.filter('jsonize', require('./filters/jsonize'));

// services
app.service('GeoCoder', require('./services/geo-coder'));
app.service('NavigatorGeolocation', require('./services/navigator-geolocation'));
app.service('Attr2MapOptions', require('./services/attr2-map-options'));
app.service('GoogleMapsApi', require('./services/google-maps-api'));
app.service('StreetView', require('./services/street-view'));

// providers
app.provider('NgMap', require('./services/ng-map'));

// factories
app.factory('NgMapPool', require('./services/ng-map-pool'));

// directives

app.directive('map', require('./directives/ng-map'));
app.directive('ngMap', require('./directives/ng-map'));
app.directive('kmlLayer', require('./directives/kml-layer'));
app.directive('bicyclingLayer', require('./directives/bicycling-layer'));
app.directive('customControl', require('./directives/custom-control'));
app.directive('customMarker', require('./directives/custom-marker'));
app.directive('marker', require('./directives/marker'));
app.directive('directions', require('./directives/directions'));
app.directive('drawingManager', require('./directives/drawing-manager'));
app.directive('dynamicMapsEngineLayer', require('./directives/dynamic-maps-engine-layer'));
app.directive('fusionTablesLayer', require('./directives/fusion-table-layer'));
app.directive('heatmapLayer', require('./directives/heatmap-layer'));
app.directive('infoWindow', require('./directives/info-window'));
app.directive('mapData', require('./directives/map-data'));
app.directive('mapLazyLoad', require('./directives/map-lazy-load'));
app.directive('mapType', require('./directives/map-type'));
app.directive('mapsEngineLayer', require('./directives/maps-engine-layer'));
app.directive('overlayMapType', require('./directives/overlay-map-type'));
app.directive('placesAutoComplete', require('./directives/places-auto-complete'));
app.directive('shape', require('./directives/shape'));
app.directive('streetViewPanorama', require('./directives/street-view-panorama'));
app.directive('trafficLayer', require('./directives/traffic-layer'));
app.directive('transitLayer', require('./directives/transit-layer'));