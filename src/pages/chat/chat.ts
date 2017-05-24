import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AboutPage} from '../about/about';
import { service } from '../service/service';
import { AlertController } from 'ionic-angular';


var databaseRef;
var databaseRef1;
var currentUser;
var listaNombres;
var listaUsuarios;
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
	user="";
	listaNombres=[];
  listaUsuarios=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private service:service,
   private alertCtrl: AlertController) {
  	var app=service.getApp();
      var database = app.database();
      currentUser=service.getUser();
      listaNombres=[];
      listaUsuarios=[];
      databaseRef = database.ref().child("users");
        databaseRef1 = database.ref().child("chatRelations");
      databaseRef.on("child_added",function(snapshot){
      if(currentUser!=snapshot.child("username").val()){
        listaNombres.push(snapshot.child("username").val());
     }
     });	

      databaseRef1.on("child_added",function(snapshot){
        var name1=snapshot.child("name1").val();
        var name2=snapshot.child("name2").val();
        if(currentUser==name1){
          listaUsuarios.push(name2);
        }else if(currentUser==name2){
          listaUsuarios.push(name1);
        }
     });  
  	this.listaNombres=listaNombres;
    this.listaUsuarios=listaUsuarios;
  }

  openChat(name): void{
  	this.navCtrl.push(AboutPage, {param1:name});
  }
  addChat(name): void{
    var data = { name1: this.service.getUser(), name2:name };
    databaseRef1.push().set(data);
  }

}
