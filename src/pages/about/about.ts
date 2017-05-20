import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { service } from '../service/service';
import {ChatPage} from '../chat/chat';

var username="App";
var databaseRef;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  chat = "";
username="";
   @ViewChild(Content) content: Content;
  
  constructor(public navCtrl: NavController, private navParams: NavParams, private service:service) {

      var app=service.getApp();
      var database = app.database();
      var auth = app.auth();
      databaseRef = database.ref().child("chat");

      databaseRef.on("child_added",function(snapshot){
      var mensaje= snapshot.child("message").val();
      var usern=snapshot.child("name").val();

      
      var listIon= document.getElementById("list");
      var div= document.createElement("div");
      var li = document.createElement("ion-item");
      var p = document.createElement("p");
      p.setAttribute('class','chat-text');
      var name=document.createElement("strong");
      name.appendChild(document.createTextNode(usern));
      p.appendChild(name);
      p.appendChild(document.createTextNode(": "+mensaje));
      listIon.appendChild(div);
      div.appendChild(li);
      li.appendChild(p);
      
     });
      auth.onAuthStateChanged(function(user){
      if(user.displayName!=null){
        username = user.displayName;
        service.setUser(username);
      }else if(user.displayName==null){
      }else{
        username = "App";
        service.setUser("App");
      }
     });


      

     

  }
   chatSend(): void{
    var data = { name: this.service.getUser(), message: this.chat}
    databaseRef.push().set(data);
    this.chat = '';
    this.content.scrollToBottom();
    }

    sendImage(): void{

    }

}
