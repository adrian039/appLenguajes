import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NewFilterPage} from '../new-filter/new-filter';
import { service } from '../service/service';

var databaseRef;
var filters;
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
filters = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,  private service: service) {
    var app = service.getApp();
    var database = app.database();
     filters = [];
    databaseRef = database.ref().child("filters");
    databaseRef.on("child_added", function (snapshot) {
    if(snapshot.child('user').val()==service.getUser()){
        filters.push(snapshot);
    }
    });
    this.filters = filters;
  }

  ionViewDidLoad() {

  }

  newFilter(): void{
    this.navCtrl.push(NewFilterPage);
  }
  
  deleteFil(data): void{
     databaseRef.child(data.key).remove();
  }

}
