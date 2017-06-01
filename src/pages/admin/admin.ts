import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { service } from '../service/service';
import { AlertController } from 'ionic-angular';
import { SCategoryPage } from '../s-category/s-category';
import { NewNotificationPage } from '../new-notification/new-notification';

var databaseRef;
var dbref;
var listaNombres;
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
	category="";
  categories="";
	listaNombres=[];
@ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, private service:service,
   private alertCtrl: AlertController) {
  	 var app=service.getApp();
      var database = app.database();
      listaNombres=[];
      databaseRef = database.ref().child("category");
      dbref=database.ref().child("notifications");
  	databaseRef.on("child_added",function(snapshot){
      listaNombres.push(snapshot);
     });	
  	this.listaNombres=listaNombres;
  }

  addCategory(): void{
  	var data = { name: this.category, icon: this.categories}
    databaseRef.push().set(data);
    this.category = '';
  }

  sCategory(name): void{
  	this.navCtrl.push(SCategoryPage, {param1:name.child("name").val()});
  }

  update(origin, target): void{
 
  databaseRef.child(origin.key).update({"/name":target});

  		
  }

  editCategory(name): void{
  	let alert = this.alertCtrl.create({
    title: 'Edit Category',
    message: 'Enter the new name for ' + name.child("name").val(),
    inputs: [
    
      {
        name: 'targetName',
        placeholder: 'Category Name',
        type: 'text'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          //console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          this.update(name, data.targetName);
          this.refreshList();
        }
      }
    ]
  });
  alert.present();
  }
 
  refreshList(): void{
  	listaNombres=[];
  	databaseRef.on("child_added",function(snapshot){
      listaNombres.push(snapshot);
     });	
  	this.listaNombres=listaNombres;
  }

  newNotification(): void{
    this.navCtrl.push(NewNotificationPage);
  }

 

}
