import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { service } from '../service/service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';



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
    private filechooser: FileChooser, private filePath: FilePath) {
    this.name1 = navParams.get('param1');
    name1 = this.name1;
    currentUser = this.service.getUser();
    var app = service.getApp();
    var database = app.database();
    var auth = app.auth();
    firestore = app.storage();
    databaseRef = database.ref().child("chatMessages");
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
        p.appendChild(document.createTextNode(": " + message));
        listIon.appendChild(div);
        div.appendChild(li);
        li.appendChild(p);
      }


    });
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

  sendImage(): void {

  }

  store() {

    this.filechooser.open().then((uri) => {

      this.getPath(uri);
    });
    /* this.filechooser.open()
       .then(uri => {
         this.getPath(uri);
       });
 */
  }

  getPath(path) {
    this.filePath.resolveNativePath(path).then(path=>{
      alert(path);
      this.nativepath=path;
      this.uploadimage();
    }).catch(error =>{
      alert(error);
    });
   
    /* this.filePath.resolveNativePath(path)
       .then(filePath => {
         alert(filePath);
       });
 */
  }

  uploadimage() {
    (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          var imageStore = firestore.ref().child('image');
          imageStore.put(imgBlob).then((res) => {
            alert('Upload Success');
          }).catch((err) => {
            alert('Upload Failed' + err);
          });
        }
      });
    });
  }
 

}