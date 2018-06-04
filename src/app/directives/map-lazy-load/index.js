const MapLazyLoad = function($compile, $timeout) {
    
    return {
        compile:function(element, attrs) {
            let src, savedHtml = [], elements = [];

            (!attrs.mapLazyLoad) && console.error('requires src with map-lazy-load');
            savedHtml.push(element.html());
            src = attrs.mapLazyLoad;
        
            /**
             * if already loaded, stop processing it
             */
            if(window.google !== undefined && window.google.maps !== undefined) {
              return false;
            }
        
            element.html('');  // will compile again after script is loaded
        
            return {
              pre: function(scope, element, attrs) {
                var mapsUrl = attrs.mapLazyLoadParams || attrs.mapLazyLoad;
            
                if(window.google === undefined || window.google.maps === undefined) {
                  elements.push({
                    scope: scope,
                    element: element,
                    savedHtml: savedHtml[elements.length],
                  });
            
                  window.lazyLoadCallback = function() {
                    console.log('Google maps script loaded:', mapsUrl);
                    $timeout(function() { /* give some time to load */
                      elements.forEach(function(elm) {
                          elm.element.html(elm.savedHtml);
                          $compile(elm.element.contents())(elm.scope);
                      });
                    }, 100);
                  };
            
                  var scriptEl = document.createElement('script');
                  console.log('Prelinking script loaded,' + src);
            
                  scriptEl.src = mapsUrl +
                    (mapsUrl.indexOf('?') > -1 ? '&' : '?') +
                    'callback=lazyLoadCallback';
            
                    if (!document.querySelector('script[src="' + scriptEl.src + '"]')) {
                      document.body.appendChild(scriptEl);
                    }
                } else {
                  element.html(savedHtml);
                  $compile(element.contents())(scope);
                }
              }
            };
        }
    };
};


MapLazyLoad.$inject = ['$compile', '$timeout'];
module.exports = MapLazyLoad;