'use strict';

function jsonizeFilter() {
    return function(str) {
      try {       // if parsable already, return as it is
        JSON.parse(str);
        return str;
      } catch(e) { // if not parsable, change little
        return str
          // wrap keys without quote with valid double quote
          .replace(/([\$\w]+)\s*:/g,
            function(_, $1) {
              return '"'+$1+'":';
            }
          )
          // replacing single quote wrapped ones to double quote
          .replace(/'([^']+)'/g,
            function(_, $1) {
              return '"'+$1+'"';
            }
          )
          .replace(/''/g, '""');
      }
    };
};


module.exports = jsonizeFilter;