/* global google */
/* global MarkerClusterer */

class CoordMapType{
    
    constructor() {
      this.tileSize = new google.maps.Size(256,256);
      this.maxZoom = 19;
      this.name = 'Tile #s';
      this.alt = 'Tile Coordinate Map Type';    
    }
          
      getTile(coord, zoom, ownerDocument) {
        var div = ownerDocument.createElement('div');
        div.innerHTML = coord;
        div.style.width = this.tileSize.width + 'px';
        div.style.height = this.tileSize.height + 'px';
        div.style.fontSize = '10';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';
        div.style.borderColor = '#AAAAAA';
        div.style.backgroundColor = '#E5E3DF';
        return div;
      };
}

export default class {
    constructor(NgMap) {

        
        // NgMap.getMap().then((map) => {        
        //     var markerCluster = new MarkerClusterer(map, markers,
        //         {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});        
        // })

        NgMap.getMap().then((map) => {
            this.map = map;
        });

        this.types = "['establishment']";
        
        let vm = this;
        
        this.placeChanged = function(bb) {
            
            console.log(bb);
            vm.place = this.getPlace();
            console.log('location', vm.place.geometry.location);
            vm.map.setCenter(vm.place.geometry.location);
        }
    }

    placeChanged(pl) {
    }
}