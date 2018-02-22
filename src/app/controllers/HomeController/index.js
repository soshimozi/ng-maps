/* global google */
/* global MarkerClusterer */

export default class {
    constructor(NgMap, $timeout) {

        
        // NgMap.getMap().then((map) => {        
        //     var markerCluster = new MarkerClusterer(map, markers,
        //         {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});        
        // })
        
        this.firstThing = 'AAAAAAAAAAAAAA';
        this.otherThings = ['BBBBBBB','CCCCCCCC'];    
        
        NgMap.getMap().then((map) => {
            this.map = map;
        });
          
        this.stores = {
            foo: { position:[41, -87], items: [1,2,3,4]},
            bar:{ position:[41, -83], items: [5,6,7,8]}
        };
          
        this.googleMapsUrl = 'https://maps.google.com/maps/api/js';
        this.pauseLoading=true;
        console.log("Starting a timer to wait for 2 seconds before the map will start loading");
        
        $timeout(() => {
            console.debug("Showing the map. The google maps api should load now.");
            this.pauseLoading=false;
        }, 2000);
    }



    showStore(evt, id) {
        this.store = this.stores[id];
        this.map.showInfoWindow('foo', this);
    }
    
    showCustomMarker(evt) {
        this.NgMap.getMap().then((map) => {
            map.customMarkers.foo.setVisible(true);
            map.customMarkers.foo.setPosition(this.getPosition());
        });
    }
    
    closeCustomMarker(evt) {
        this.style.display = 'none';
    }
    
          
    click() {
        alert(1);
    };
    
    
    toggleHeatmap(event) {
      this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
    };

    changeGradient() {
      var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
      this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
    }

    changeRadius() {
      this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
    }

    changeOpacity() {
      this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
    }    

}