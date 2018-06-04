'use strict';

var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCaseFilter() {
    return function(name) {
      return name.
        replace(SPECIAL_CHARS_REGEXP,
          function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).
        replace(MOZ_HACK_REGEXP, 'Moz$1');
    };
};
  
  
module.exports = camelCaseFilter;