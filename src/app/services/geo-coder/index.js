/* global google */

'use strict';
var $q;

/**
* @memberof GeoCoder
* @param {Hash} options
*   https://developers.google.com/maps/documentation/geocoding/#geocoding
* @example
* ```
*   GeoCoder.geocode({address: 'the cn tower'}).then(function(result) {
*     //... do something with result
*   });
* ```
* @returns {HttpPromise} Future object
*/
const geocodeFunc = function(options) {
    var deferred = $q.defer();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(options, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            deferred.resolve(results);
        } else {
            deferred.reject(status);
        }
    });
    
    return deferred.promise;
};

const GeoCoder = function(_$q_) {
    $q = _$q_;
    return {
        geocode : geocodeFunc
    };
};

GeoCoder.$inject = ['$q'];

module.exports = GeoCoder;