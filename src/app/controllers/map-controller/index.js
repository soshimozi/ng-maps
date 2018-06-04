  /* global google */
  
  'use strict';
  
  const angular = require('angular');
  
  export default class {
  
    constructor($scope, $element, $attrs, $parse, $interpolate, Attr2MapOptions, NgMap, NgMapPool, escapeRegExpFilter) {
        this.Attr2MapOptions = Attr2MapOptions;
    
        this.exprStartSymbol = $interpolate.startSymbol();
        this.exprEndSymbol = $interpolate.endSymbol();

        this.mapOptions; /** @memberof __MapController */
        this.mapEvents;  /** @memberof __MapController */
        this.eventListeners;  /** @memberof __MapController */
        
        this.$scope = $scope;
        this.$element = $element;
        this.$attrs = $attrs;
        this.$parse = $parse;
        this.$interpolate = $interpolate;
        this.NgMap = NgMap;
        this.NgMapPool = NgMapPool;
        this.escapeRegExp = escapeRegExpFilter;
        
        this.$scope.google = google; //used by $scope.eval to avoid eval()
    
        /**
         * get map options and events
         */
        this.orgAttrs = this.Attr2MapOptions.orgAttributes(this.$element);
        var filtered = this.Attr2MapOptions.filter(this.$attrs);
        var options = this.Attr2MapOptions.getOptions(filtered, {scope: this.$scope});
        var controlOptions = this.Attr2MapOptions.getControlOptions(filtered);
        var mapOptions = angular.extend(options, controlOptions);
        var mapEvents = this.Attr2MapOptions.getEvents(this.$scope, filtered);
        console.log('ng-map Options', mapOptions);
        Object.keys(mapEvents).length && console.log('ng-map Events', mapEvents);
    
        this.mapOptions = mapOptions;
        this.mapEvents = mapEvents;
        this.eventListeners = {};
    
        if (options.lazyInit) { // allows controlled initialization
          // parse angular expression for dynamic ids
          if (!!this.$attrs.id &&
          	  // starts with, at position 0
    	  this.$attrs.id.indexOf(this.exprStartSymbol, 0) === 0 &&
    	  // ends with
    	  this.$attrs.id.indexOf(this.exprEndSymbol, this.$attrs.id.length - this.exprEndSymbol.length) !== -1) {
            var idExpression = this.$attrs.id.slice(2,-2);
            var mapId = this.$parse(idExpression)(this.$scope);
          } else {
            var mapId = this.$attrs.id;
          }
          this.map = {id: mapId}; //set empty, not real, map
          this.NgMap.addMap(this);
        } else {
          this.initializeMap();
        }
    
        //Trigger Resize
        if(options.triggerResize) {
          google.maps.event.trigger(this.map, 'resize');
        }
    
        this.$element.bind('$destroy', function() {
          this.NgMapPool.returnMapInstance(this.map);
          this.NgMap.deleteMap(this);
        });
    }
    
    /**
     * Add an object to the collection of group
     * @memberof __MapController
     * @function addObject
     * @param groupName the name of collection that object belongs to
     * @param obj  an object to add into a collection, i.e. marker, shape
     */
    addObject (groupName, obj) {
      if (this.map) {
        this.map[groupName] = this.map[groupName] || {};
        var len = Object.keys(this.map[groupName]).length;
        this.map[groupName][obj.id || len] = obj;

        if (this.map instanceof google.maps.Map) {
          //infoWindow.setMap works like infoWindow.open
          if (groupName != "infoWindows" && obj.setMap) {
            obj.setMap && obj.setMap(this.map);
          }
          if (obj.centered && obj.position) {
            this.map.setCenter(obj.position);
          }
          (groupName == 'markers') && this.objectChanged('markers');
          (groupName == 'customMarkers') && this.objectChanged('customMarkers');
        }
      }
    }

    /**
     * Delete an object from the collection and remove from map
     * @memberof __MapController
     * @function deleteObject
     * @param {Array} objs the collection of objects. i.e., map.markers
     * @param {Object} obj the object to be removed. i.e., marker
     */
    deleteObject (groupName, obj) {
      /* delete from group */
      if (obj.map) {
        var objs = obj.map[groupName];
        for (var name in objs) {
          if (objs[name] === obj) {
            console.log('Deleting', groupName, obj);
            google.maps.event.clearInstanceListeners(obj);
            delete objs[name];
          }
        }

        /* delete from map */
        obj.map && obj.setMap && obj.setMap(null);

        (groupName == 'markers') && this.objectChanged('markers');
        (groupName == 'customMarkers') && this.objectChanged('customMarkers');
      }
    }

    /**
     * @memberof __MapController
     * @function observeAttrSetObj
     * @param {Hash} orgAttrs attributes before its initialization
     * @param {Hash} attrs    attributes after its initialization
     * @param {Object} obj    map object that an action is to be done
     * @description watch changes of attribute values and
     * do appropriate action based on attribute name
     */
    observeAttrSetObj (orgAttrs, attrs, obj) {
      if (attrs.noWatcher) {
        return false;
      }
      var attrsToObserve = this.Attr2MapOptions.getAttrsToObserve(orgAttrs);
      for (var i=0; i<attrsToObserve.length; i++) {
        var attrName = attrsToObserve[i];
        attrs.$observe(attrName, this.NgMap.observeAndSet(attrName, obj));
      }
    }

    /**
     * @memberof __MapController
     * @function zoomToIncludeMarkers
     */
    zoomToIncludeMarkers() {
      // Only fit to bounds if we have any markers
      // object.keys is supported in all major browsers (IE9+)
      if ((this.map.markers != null && Object.keys(this.map.markers).length > 0) || (this.map.customMarkers != null && Object.keys(this.map.customMarkers).length > 0)) {
        var bounds = new google.maps.LatLngBounds();
        for (var k1 in this.map.markers) {
          bounds.extend(this.map.markers[k1].getPosition());
        }
        for (var k2 in this.map.customMarkers) {
          bounds.extend(this.map.customMarkers[k2].getPosition());
        }
    	  if (this.mapOptions.maximumZoom) {
    		  this.enableMaximumZoomCheck = true; //enable zoom check after resizing for markers
    	  }
        this.map.fitBounds(bounds);
      }
    }

    /**
     * @memberof __MapController
     * @function objectChanged
     * @param {String} group name of group e.g., markers
     */
    objectChanged(group) {
      if ( this.map &&
        (group == 'markers' || group == 'customMarkers') &&
        this.map.zoomToIncludeMarkers == 'auto'
      ) {
        this.zoomToIncludeMarkers();
      }
    }

    /**
     * @memberof __MapController
     * @function initializeMap
     * @description
     *  . initialize Google map on <div> tag
     *  . set map options, events, and observers
     *  . reset zoom to include all (custom)markers
     */
    initializeMap() {
      var mapOptions = this.mapOptions,
          mapEvents = this.mapEvents;

      var lazyInitMap = this.map; //prepared for lazy init
      this.map = this.NgMapPool.getMapInstance(this.$element[0]);
      this.NgMap.setStyle(this.$element[0]);

      // set objects for lazyInit
      if (lazyInitMap) {

        /**
         * rebuild mapOptions for lazyInit
         * because attributes values might have been changed
         */
        var filtered = this.Attr2MapOptions.filter(this.$attrs);
        var options = this.Attr2MapOptions.getOptions(filtered);
        var controlOptions = this.Attr2MapOptions.getControlOptions(filtered);
        mapOptions = angular.extend(options, controlOptions);
        console.log('map options', mapOptions);

        for (var group in lazyInitMap) {
          var groupMembers = lazyInitMap[group]; //e.g. markers
          if (typeof groupMembers == 'object') {
            for (var id in groupMembers) {
              this.addObject(group, groupMembers[id]);
            }
          }
        }
        this.map.showInfoWindow = this.showInfoWindow;
        this.map.hideInfoWindow = this.hideInfoWindow;
      }

      // set options
      mapOptions.zoom = (mapOptions.zoom && !isNaN(mapOptions.zoom)) ? +mapOptions.zoom : 15;
      var center = mapOptions.center;
      var exprRegExp = new RegExp(this.escapeRegExp(this.exprStartSymbol) + '.*' + this.escapeRegExp(this.exprEndSymbol));

      if (!mapOptions.center ||
        ((typeof center === 'string') && center.match(exprRegExp))
      ) {
        mapOptions.center = new google.maps.LatLng(0, 0);
      } else if( (typeof center === 'string') && center.match(/^[0-9.-]*,[0-9.-]*$/) ){
        var lat = parseFloat(center.split(',')[0]);
        var lng = parseFloat(center.split(',')[1]);
        mapOptions.center = new google.maps.LatLng(lat, lng);
      } else if (!(center instanceof google.maps.LatLng)) {
        var geoCenter = mapOptions.center;
        delete mapOptions.center;
        this.NgMap.getGeoLocation(geoCenter, mapOptions.geoLocationOptions).
          then((latlng) => {
            this.map.setCenter(latlng);
            var geoCallback = mapOptions.geoCallback;
            geoCallback && this.$parse(geoCallback)(this.$scope);
          }, function () {
            if (mapOptions.geoFallbackCenter) {
              this.map.setCenter(mapOptions.geoFallbackCenter);
            }
          });
      }
      this.map.setOptions(mapOptions);

      // set events
      for (var eventName in mapEvents) {
        var event = mapEvents[eventName];
        var listener = google.maps.event.addListener(this.map, eventName, event);
        this.eventListeners[eventName] = listener;
      }

      // set observers
      this.observeAttrSetObj(this.orgAttrs, this.$attrs, this.map);
      this.singleInfoWindow = mapOptions.singleInfoWindow;

      google.maps.event.trigger(this.map, 'resize');

      google.maps.event.addListenerOnce(this.map, "idle", () => {
        this.NgMap.addMap(this);
        if (mapOptions.zoomToIncludeMarkers) {
          this.zoomToIncludeMarkers();
        }
        //TODO: it's for backward compatibiliy. will be removed
        this.$scope.map = this.map;
        this.$scope.$emit('mapInitialized', this.map);

        //callback
        if (this.$attrs.mapInitialized) {
          this.$parse(this.$attrs.mapInitialized)(this.$scope, {map: this.map});
        }
      });

	  //add maximum zoom listeners if zoom-to-include-markers and and maximum-zoom are valid attributes
	  if (mapOptions.zoomToIncludeMarkers && mapOptions.maximumZoom) {
	    google.maps.event.addListener(this.map, 'zoom_changed', () => {
          if (this.enableMaximumZoomCheck == true) {
			this.enableMaximumZoomCheck = false;
	        google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
		      this.map.setZoom(Math.min(mapOptions.maximumZoom, this.map.getZoom()));
		    });
	  	  }
	    });
	  }
    }
  } // __MapController
