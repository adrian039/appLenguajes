import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import { ToastController } from 'ionic-angular';

var notifications;
var databaseRef;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	notifications=[];
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service:service) {
  		var app=service.getApp();
      var database = app.database();
      notifications=[];
      databaseRef=database.ref().child("notifications");
      databaseRef.on("child_added", function (snapshot) {
        if(snapshot.child('state').val()=='active'){
           notifications.push(snapshot);
        }
      });
      this.notifications=notifications;
      
  }


 

}
