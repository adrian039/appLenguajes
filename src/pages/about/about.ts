import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { service } from '../service/service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { LoadingController } from 'ionic-angular';

var username = "App";
var databaseRef;
var name1;
var currentUser;
var firestore;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  chat = "";
  username = "";
  name1 = "";
  nativepath: any;
  imgsource: any;
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, private navParams: NavParams, private service: service,
    private filechooser: FileChooser, private filePath: FilePath, public loadingCtrl: LoadingController) {
    this.name1 = navParams.get('param1');
    name1 = this.name1;
    currentUser = this.service.getUser();
    var app = service.getApp();
    var database = app.database();
    var auth = app.auth();
    firestore = app.storage();
    databaseRef = database.ref().child("chatMessages");
    auth.onAuthStateChanged(function (user) {
      if (user.displayName != null) {
        username = user.displayName;
        //service.setUser(username);
      } else if (user.displayName == null) {
      } else {
        username = "App";
        //service.setUser("App");
      }
    });
  }

  chatSend(): void {
    var data = { origin: currentUser, message: this.chat, target: name1 }
    databaseRef.push().set(data);
    this.chat = '';
    this.content.scrollToBottom();
  }

  store() {

    this.filechooser.open().then((uri) => {

      this.filePath.resolveNativePath(uri).then(path => {
        this.nativepath = path;
        this.uploadimage();
      }).catch(error => {
        alert(error);
      });
    });
  }

  uploadimage() {
    var fileName;
    let loader = this.loadingCtrl.create({
      content: "Loading File...",

    });
    loader.present();
    (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
      fileName = res.name;
      var num = this.nativepath.length - 1;
      var exte = this.nativepath.charAt(num - 2) + this.nativepath.charAt(num - 1) + this.nativepath.charAt(num);
      if ((exte == 'jpg') || (exte == 'png') || (exte == 'peg')) {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
            var imageStore = firestore.ref('/chatFiles/').child(fileName);
            imageStore.put(imgBlob).then((res) => {
              firestore.ref('/chatFiles/').child(fileName).getDownloadURL().then((url) => {
                this.chat = url;
                this.chatSend();
                loader.dismiss();
              });
              firestore.ref().child(fileName).getDownloadURL()
            }).catch((err) => {
              alert('Upload Failed' + err);
            });

          }
        });
      } else if ((exte == 'mp4') || (exte == 'avi')) {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: 'video/mp4' });
            var imageStore = firestore.ref('/chatFiles/').child(fileName);
            imageStore.put(imgBlob).then((res) => {
              firestore.ref('/chatFiles/').child(fileName).getDownloadURL().then((url) => {
                this.chat = url;
                this.chatSend();
                loader.dismiss();
              });
              firestore.ref().child(fileName).getDownloadURL()
            }).catch((err) => {
              alert('Upload Failed' + err);
            });

          }
        });
      }
    });
  }

  deleteAll() {

  }

  ionViewDidLoad() {
    databaseRef.on("child_added", function (snapshot) {
      var message = snapshot.child("message").val();
      var user1 = snapshot.child("origin").val();
      var user2 = snapshot.child("target").val();
      if (((user1 == name1) && (user2 == currentUser)) || ((user1 == currentUser) && (user2 == name1))) {
        var listIon = document.getElementById("list");
        var div = document.createElement("div");
        var li = document.createElement("ion-item");
        var p = document.createElement("p");
        p.setAttribute('class', 'chat-text');
        var name = document.createElement("strong");
        name.appendChild(document.createTextNode(user1));
        p.appendChild(name);
        li.appendChild(p);
        if (message.length > 60) {
          var xte = message.charAt(message.length - 56) + message.charAt(message.length - 55) + message.charAt(message.length - 54);
        }
        if (message.indexOf("https://firebasestorage.googleapis.com/") == 0) {
          if (xte == 'mp4') {
            var video = document.createElement("div");
            var source = document.createElement("iframe");
            source.setAttribute('src', message);
            source.setAttribute('controls', "controls");
            video.appendChild(source);
            li.appendChild(video);
          } else {
            var imgElm = document.createElement("img");
            imgElm.src = message;
            li.appendChild(imgElm);
          }
        }
        else {

          p.appendChild(document.createTextNode(": " + message));
          li.appendChild(p);

        }
        listIon.appendChild(div);
        div.appendChild(li);
      }


    });
  }

}