/* global google */

const angular = require('angular');


  var supportedTransform = (function getSupportedTransform() {
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
    var div = document.createElement('div');
    for(var i = 0; i < prefixes.length; i++) {
      if(div && div.style[prefixes[i]] !== undefined) {
        return prefixes[i];
      }
    }
    return false;
  })();
  
export default class CustomMarker2 extends google.maps.OverlayView {
    constructor(scope, $parse, $compile, $timeout, options) {
      super();
      
      this.scope = scope;
      this.$parse = $parse;
      this.$compile = $compile;
      this.$timeout = $timeout;
      
      this.options = options || {};
      this.el = document.createElement('div');
      this.el.style.display = 'block';
      this.el.style.visibility = "hidden";
      this.visible = true;
      for (var key in this.options) { /* jshint ignore:line */
       this[key] = this.options[key];
      }     
    }
    
    setContent(html, scope) {
        this.el.innerHTML = html;
        this.el.style.position = 'absolute';
        this.el.style.top = 0;
        this.el.style.left = 0;
        if (scope) {
          this.$compile(angular.element(this.el).contents())(scope);
        }
      }
      
      getDraggablefunction() {
        return this.draggable;
      }
  
      setDraggable(draggable) {
        this.draggable = draggable;
      }
  
      getPosition() {
        return this.position;
      }
  
      setPosition(position) {
        position && (this.position = position); /* jshint ignore:line */
        var _this = this;
        if (this.getProjection() && typeof this.position.lng == 'function') {
          console.log(_this.getProjection());
          var setPosition = function() {
            if (!_this.getProjection()) { return; }
            var posPixel = _this.getProjection().fromLatLngToDivPixel(_this.position);
            var x = Math.round(posPixel.x - (_this.el.offsetWidth/2));
            var y = Math.round(posPixel.y - _this.el.offsetHeight - 10); // 10px for anchor
            if (supportedTransform) {
              _this.el.style[supportedTransform] = "translate(" + x + "px, " + y + "px)";
            } else {
              _this.el.style.left = x + "px";
              _this.el.style.top = y + "px";
            }
            _this.el.style.visibility = "visible";
          };
          if (_this.el.offsetWidth && _this.el.offsetHeight) {
            setPosition();
          } else {
            //delayed left/top calculation when width/height are not set instantly
            _this.$timeout(setPosition, 300);
          }
        }
      }
  
      setZIndex(zIndex) {
        if (zIndex === undefined) return;
        (this.zIndex !== zIndex) && (this.zIndex = zIndex); /* jshint ignore:line */
        (this.el.style.zIndex !== this.zIndex) && (this.el.style.zIndex = this.zIndex);
      }
  
      getVisible() {
        return this.visible;
      }
  
      setVisible(visible) {
        if (this.el.style.display === 'none' && visible)
        {
            this.el.style.display = 'block';
        } else if (this.el.style.display !== 'none' && !visible) {
            this.el.style.display = 'none';
        }
        this.visible = visible;
      }
  
      addClass(className) {
        var classNames = this.el.className.trim().split(' ');
        (classNames.indexOf(className) == -1) && classNames.push(className); /* jshint ignore:line */
        this.el.className = classNames.join(' ');
      }
  
      removeClass(className) {
        var classNames = this.el.className.split(' ');
        var index = classNames.indexOf(className);
        (index > -1) && classNames.splice(index, 1); /* jshint ignore:line */
        this.el.className = classNames.join(' ');
      }
  
      onAdd() {
        this.getPanes().overlayMouseTarget.appendChild(this.el);
      }
  
      draw() {
        this.setPosition();
        this.setZIndex(this.zIndex);
        this.setVisible(this.visible);
      }
  
      onRemove() {
        this.el.parentNode.removeChild(this.el);
        //this.el = null;
      }   
      
      
  }
  
  