import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { service } from '../service/service';
import { CategoryPage } from '../category/category';

var databaseRef;
@Component({
  selector: 'page-new-filter',
  templateUrl: 'new-filter.html',
})
export class NewFilterPage {
  minPrice="";
  maxPrice="";
  distance="";
  country="";
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: service) {
    var app = service.getApp();
    var database = app.database();
    databaseRef = database.ref().child('filters');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewFilter');
  }

  selectCat(type): void {
    if (type == 'category') {
      this.navCtrl.push(CategoryPage, { type: 'category' });
    } else {
      this.navCtrl.push(CategoryPage, { type: 'subCategory', source: this.service.category });
    }
  }

  saveFilter(): void{
    var cat="";
    var sCat="";
    if(this.service.category!='Category'){
      cat=this.service.category;
    }
    if(this.service.subCategory!='SubCategory'){
      sCat=this.service.subCategory;
    }
    var data={category: cat, subCategory: sCat, minPrice: this.minPrice, maxPrice:this.maxPrice, 
      distance:this.distance, user: this.service.getUser(), country: this.country};
    databaseRef.push().set(data);
    this.service.category='Category';
    this.service.subCategory='SubCategory';
    this.minPrice="";
    this.maxPrice="";
    this.distance="";
    this.country="";
    alert("Filter has been created! :)");
  }

}
