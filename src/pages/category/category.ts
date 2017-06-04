import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { service } from '../service/service';

var type;
var source;
var dataList;
var databaseRef;
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  type = '';
  source = '';
  dataList = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: service) {
    type = this.navParams.get('type');
    this.type = type;
    dataList = [];
    var app = service.getApp();
    var database = app.database();
    if (type == "category") {
      databaseRef = database.ref().child("category");
      databaseRef.on("child_added", function (snapshot) {
        dataList.push(snapshot);
      });
      this.dataList = dataList;

    } else if (this.navParams.get('source') != 'Category') {
      databaseRef = database.ref().child("sCategory");
      source = this.navParams.get('source');
      databaseRef.on("child_added", function (snapshot) {
        if (snapshot.child('origin').val() == source) {
          dataList.push(snapshot);
        }
      });
      this.dataList = dataList;
    } else if (this.navParams.get('source') == 'Category') {
      alert("First select a Category!  :)");
      this.navCtrl.pop();
    }
  }

  select(data): void {
    if (type == 'category') {
      this.service.category = data.child('name').val();
    } else {
      this.service.subCategory = data.child('name').val();
    }
    this.navCtrl.pop();
  }



}
