import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { service } from '../service/service';
import { AlertController } from 'ionic-angular';


var databaseRef;
var listaNombres;
var par;
@Component({
  selector: 'page-s-category',
  templateUrl: 's-category.html',
})
export class SCategoryPage {
	par1="";
	category="";
  categories="";
	listaNombres=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private service:service,
   private alertCtrl: AlertController) {
  	this.par1=navParams.get('param1');
  	par=this.par1;
  	var app=service.getApp();
      var database = app.database();
      listaNombres=[];
      databaseRef = database.ref().child("sCategory");
  	databaseRef.on("child_added",function(snapshot){
      var origin=snapshot.child("origin").val();
      if(origin==par){
      	listaNombres.push(snapshot);
      }
      
     });	
  	this.listaNombres=listaNombres;
  }

  addCategory(): void{
  	var data = { name: this.category, origin: this.par1, icon: this.categories}
    databaseRef.push().set(data);
    this.category = '';
  }

  update(origin, target): void{
  	databaseRef.child(origin.key).update({"/name":target});	
  }
 
  editCategory(name): void{
  	let alert = this.alertCtrl.create({
    title: 'Edit Sub-Category',
    message: 'Enter the new name for ' + name.child("name").val(),
    inputs: [
    
      {
        name: 'targetName',
        placeholder: 'Sub-Category Name',
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
      var origin=snapshot.child("origin").val();
      if(origin==par){
      	listaNombres.push(snapshot);
      }
      
     });	
  	this.listaNombres=listaNombres;
  }
 
}
