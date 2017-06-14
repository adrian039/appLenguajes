import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, GoogleMap, LatLng, CameraPosition, GoogleMapsEvent, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { service } from '../service/service';


@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  lat = 0;
  lon = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
    private service: service, ) {
    this.lat = this.navParams.get('lat');
    this.lon = this.navParams.get('lon');
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');
    let map: GoogleMap = this.googleMaps.create(element);

    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        let ionic: LatLng = new LatLng(+this.service.latitude, +this.service.longitude);

        // create CameraPosition
        let position: CameraPosition = {
          target: ionic,
          zoom: 18,
          tilt: 30
        };

        // move the map's camera to position
        map.moveCamera(position);

        let markerOptions: MarkerOptions = {
          position: ionic,
          title: 'YOU'
        };

        var marker = map.addMarker(markerOptions)
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });

        let pos: LatLng = new LatLng(+this.lat, +this.lon);
        let markerOptions1: MarkerOptions = {
          position: pos,
          title: 'BOOK'
        };

        var marker1 = map.addMarker(markerOptions1)
          .then((marker1: Marker) => {
            marker1.showInfoWindow();
          });



      }
    );

  }

}
