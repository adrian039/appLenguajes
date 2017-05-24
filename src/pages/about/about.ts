import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { service } from '../service/service';

var username="App";
var databaseRef;
var name1;
var currentUser;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  chat = "";
username="";
name1="";

   @ViewChild(Content) content: Content;
  
  constructor(public navCtrl: NavController, private navParams: NavParams, private service:service) {
      this.name1=navParams.get('param1');
      name1=this.name1;
      currentUser=this.service.getUser();
      var app=service.getApp();
      var database = app.database();
      var auth = app.auth();
      databaseRef = database.ref().child("chatMessages");

      databaseRef.on("child_added",function(snapshot){
      var message= snapshot.child("message").val();
      var user1=snapshot.child("origin").val();
      var user2=snapshot.child("target").val();
      if(((user1==name1)&&(user2==currentUser))||((user1==currentUser)&&(user2==name1))){
         var listIon= document.getElementById("list");
        var div= document.createElement("div");
        var li = document.createElement("ion-item");
        var p = document.createElement("p");
        p.setAttribute('class','chat-text');
        var name=document.createElement("strong");
        name.appendChild(document.createTextNode(user1));
        p.appendChild(name);
        p.appendChild(document.createTextNode(": "+message));
        listIon.appendChild(div);
        div.appendChild(li);
        li.appendChild(p);
      }
      
      
     });
      auth.onAuthStateChanged(function(user){
      if(user.displayName!=null){
        username = user.displayName;
        //service.setUser(username);
      }else if(user.displayName==null){
      }else{
        username = "App";
        //service.setUser("App");
      }
     });


      

     

  }
   chatSend(): void{
    var data = { origin: currentUser, message: this.chat, target: name1}
    databaseRef.push().set(data);
    this.chat = '';
    this.content.scrollToBottom();
    }

    sendImage(): void{

    }

}
