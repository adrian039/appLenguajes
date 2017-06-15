import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NewFilterPage} from '../new-filter/new-filter';
import { service } from '../service/service';

var databaseRef;
var databaseRef1;
var filters;
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
filters = [];
sound="";
  constructor(public navCtrl: NavController, public navParams: NavParams,  private service: service) {
    var app = service.getApp();
    var database = app.database();
     filters = [];
    databaseRef = database.ref().child("filters");
     databaseRef1 = database.ref().child("users");
    databaseRef.on("child_added", function (snapshot) {
    if(snapshot.child('user').val()==service.getUser()){
        filters.push(snapshot);
    }
    });
    this.filters = filters;
    this.sound=service.sound;
  }

  ionViewDidLoad() {

  }

  newFilter(): void{
    this.navCtrl.push(NewFilterPage);
  }
  
  deleteFil(data): void{
     databaseRef.child(data.key).remove();
  }
  
  saveSound(){
    console.log(this.sound);
    var sound=this.sound;
    var user= this.service.getUserInfo();
    databaseRef1.child(user.key).update({ "/sound": sound });
    alert("You notifications sound has been changed! :)");
    this.service.sound=this.sound;
  }
}
