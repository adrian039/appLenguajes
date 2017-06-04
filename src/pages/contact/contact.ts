import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import {MySalesPage} from '../my-sales/my-sales';
import { PhotoViewer } from '@ionic-native/photo-viewer';


var databaseRef;
var notifications;

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  notifications = [];
  constructor(public navCtrl: NavController, private service: service, private photoViewer: PhotoViewer) {
    var app = service.getApp();
    var database = app.database();
     notifications = [];
    databaseRef = database.ref().child("notifications");
    databaseRef.on("child_added", function (snapshot) {
      var user = snapshot.child('user').val();
      if (user == service.getUser()) {
        notifications.push(snapshot);
      }
    });
    this.notifications = notifications;
 
  }

  newSale(): void{
    this.navCtrl.push(MySalesPage);
  }

  viewPhotos(data): void{
    var img1=data.child('image1').val();
    var img2=data.child('image2').val();
    var img3=data.child('image3').val();
    this.photoViewer.show(img1);
    this.photoViewer.show(img2);
    this.photoViewer.show(img3);
  }

  deleteNot(data): void {
    databaseRef.child(data.key).remove();
  }

  lockNot(data, cond): void {
    if (cond == 'lock') {
      databaseRef.child(data.key).update({ "/state": 'lock' });
    } else {
      databaseRef.child(data.key).update({ "/state": 'active' });
    }
  }
}
