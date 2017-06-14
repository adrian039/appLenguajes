import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import { ToastController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Geolocation } from '@ionic-native/geolocation';
import { MapsPage } from '../maps/maps';

var notifications;
var databaseRef;
var i;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  notifications = [];
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service: service,
    private photoViewer: PhotoViewer, private geolocation: Geolocation) {
    //comentario

    function rad(x) {
      return x * Math.PI / 180;
    }

    function getDistance(lat, long, lat1, long1) {
      var R = 6378.137; //Radio de la tierra en km
      var dLat = rad(lat1 - lat);
      var dLong = rad(long1 - long);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat)) * Math.cos(rad(lat1)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      console.log("hola hola" + d.toFixed(3));
      return d.toFixed(3); //Retorna tres decimales
    }
    var app = service.getApp();
    var database = app.database();
    notifications = [];
    var not = +service.notifications;
    var cont = 0;
    databaseRef = database.ref().child("notifications");
    databaseRef.on("child_added", function (snapshot) {
      if ((snapshot.child('state').val() == 'active') && (snapshot.child('user').val() == 'admin')) {
        var cat = snapshot.child('category').val();
        var sCat = snapshot.child('subCategory').val();
        var country = snapshot.child('country').val();
        if (service.getFilters().length == 0) {
          console.log("hola");
          notifications.push(snapshot);
          cont++;
        } else {
          for (i = 0; i < service.getFilters().length; i++) {
            var data = service.getFilters()[i];
            var filCat = data.child('category').val();
            var filScat = data.child('subCategory').val();
            var filCountry = data.child('country').val();
            if ((filCat == "") && (filScat == "")) {
              if (filCountry == "") {
                notifications.push(snapshot);

              } else if (filCountry == country) {
                notifications.push(snapshot);
              }

            } else if ((filCat != "") && (filScat == "")) {
              if (filCat == cat) {
                if (filCountry == "") {
                  notifications.push(snapshot);

                } else if (filCountry == country) {
                  notifications.push(snapshot);
                }
              }
            } else if ((filCat != "") && (filScat != "")) {
              if ((filCat == cat) && (filScat == sCat)) {
                if (filCountry == "") {
                  notifications.push(snapshot);

                } else if (filCountry == country) {
                  notifications.push(snapshot);
                }
              }
            }
          }
        }

      } else if ((snapshot.child('user').val() != service.getUser()) && (snapshot.child('state').val() == 'active') &&
        (cont < not)) {
        var cat = snapshot.child('category').val();
        var sCat = snapshot.child('subCategory').val();
        var price = +snapshot.child('price').val();
        var country = snapshot.child('country').val();
        var latitude = snapshot.child('latitude').val();
        var longitude = snapshot.child('longitude').val();
        if (service.getFilters().length == 0) {
          console.log("hola");
          notifications.push(snapshot);
          cont++;
        } else {
          for (i = 0; i < service.getFilters().length; i++) {
            var data = service.getFilters()[i];
            var filCat = data.child('category').val();
            var filScat = data.child('subCategory').val();
            var filMinPrice = data.child('minPrice').val();
            var filMaxPrice = data.child('maxPrice').val();
            var filCountry = data.child('country').val();
            var filDistance = data.child('distance').val();
            if ((filCat == "") && (filScat == "")) {
              if (filCountry == "") {
                if (filMinPrice == "") {
                  if (filDistance == "") {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  }
                } else if ((+filMinPrice <= +price) && (+filMaxPrice >= +price)) {
                  if (filDistance == "") {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  }
                }

              } else if (filCountry == country) {
                if (filMinPrice == "") {
                  if (filDistance == "") {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  }
                } else if ((+filMinPrice <= +price) && (+filMaxPrice >= +price)) {
                  if (filDistance == "") {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                    notifications.push(snapshot);
                    cont++;
                    break;
                  }
                }
              }

            } else if ((filCat != "") && (filScat == "")) {
              if (filCat == cat) {
                if (filCountry == "") {
                  if (filMinPrice == "") {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  } else if ((+filMinPrice <= +price) && (+filMaxPrice >= +price)) {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  }

                } else if (filCountry == country) {
                  if (filMinPrice == "") {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  } else if ((+filMinPrice <= +price) && (+filMaxPrice >= +price)) {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  }
                }
              }
            } else if ((filCat != "") && (filScat != "")) {
              if ((filCat == cat) && (filScat == sCat)) {
                if (filCountry == "") {
                  if (filMinPrice == "") {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  } else if ((+filMinPrice <= +price) && (+filMaxPrice >= +price)) {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  }

                } else if (filCountry == country) {
                  if (filMinPrice == "") {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  } else if ((+filMinPrice <= +price) && (+filMaxPrice >= +price)) {
                    if (filDistance == "") {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    } else if (+getDistance(latitude, longitude, service.latitude, service.longitude) <= +filDistance) {
                      notifications.push(snapshot);
                      cont++;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

      }
    });
    this.notifications = notifications;
  }

  viewPhotos(data): void {
    var img1 = data.child('image1').val();
    var img2 = data.child('image2').val();
    var img3 = data.child('image3').val();
    this.photoViewer.show(img1);
    this.photoViewer.show(img2);
    this.photoViewer.show(img3);
  }
  
  openMap(data){
    this.navCtrl.push(MapsPage, {lat: data.child('latitude').val(), 
  lon: data.child('longitude').val()});
  }



}
