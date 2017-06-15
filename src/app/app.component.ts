import { Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { StatusBar } from '@ionic-native/status-bar';
import { AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import firebase from 'firebase';
import { service } from '../pages/service/service';
import {TabsPage} from '../pages/tabs/tabs';
import {FiltersPage} from '../pages/filters/filters';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

import { LoadingController } from 'ionic-angular';

var databaseRef;
var firestore;
@Component({
  templateUrl: 'app.html',
  providers: [service]
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;
  rootPage: any = LoginPage;
  name="";
  username="";
  email="";
  phone="";
  country="";
  image="";
  constructor(platform: Platform, private service: service, statusBar: StatusBar, splashScreen: SplashScreen,
    public translateService: TranslateService, private alertCtrl: AlertController,  private filechooser: FileChooser,
    private filePath: FilePath, private imageResizer: ImageResizer, public loadingCtrl: LoadingController) {
    var config = {
      apiKey: "AIzaSyDzLzteM80SiCuZXLUptu4BbDLrX7Nmtbo",
      authDomain: "base-58db2.firebaseapp.com",
      databaseURL: "https://base-58db2.firebaseio.com",
      projectId: "base-58db2",
      storageBucket: "base-58db2.appspot.com",
      messagingSenderId: "187027053913"
    };
    // Get the Firebase app and all primitives we'll use
    service.setUser('App');
    var app = firebase.initializeApp(config);
    translateService.setDefaultLang('en');
    service.setApp(app);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
   var app1 = service.getApp();
   var database = app1.database();
   firestore = app1.storage();
   databaseRef = database.ref().child("users");

  }

  translateToSpanish() {
    this.translateService.use('es');
  }
  translateToEnglish() {
    this.translateService.use('en');
  }

  openPage(page){
    if(page=='home'){
      this.nav.setRoot(TabsPage);
    }else if(page=='logout'){
      this.service.setUser('App');
      this.nav.setRoot(LoginPage);
    }else if(page=='filters'){
      this.nav.setRoot(FiltersPage);
    }
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Notification Manager',
      message: 'How many notifications to show?',
      inputs: [

        {
          name: 'quantity',
          placeholder: 'Quantity',
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
            var user= this.service.getUserInfo();
            databaseRef.child(user.key).update({ "/notifications": data.quantity });
          }
        }
      ]
    });
    alert.present();
  }

   editInfo() {
    let alert = this.alertCtrl.create({
      title: 'Edit Info',
      message: 'Enter the new user info.',
      inputs: [

        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        },
         {
          name: 'phone',
          placeholder: 'Phone',
          type: 'text'
        },
         {
          name: 'address',
          placeholder: 'Address',
          type: 'text'
        },
         {
          name: 'username',
          placeholder: 'Username',
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
            var user = this.service.getUserInfo();
            databaseRef.child(user.key).update({ "/name": data.name });
            databaseRef.child(user.key).update({ "/phone": data.phone });
            databaseRef.child(user.key).update({ "/address": data.address });
            databaseRef.child(user.key).update({ "/username": data.username });
            this.service.setUser(data.username);
            this.service.address=data.address;
            this.service.phone=data.phone;
            this.service.name=data.name;
          }
        }
      ]
    });
    alert.present();
  }

  updateImage(){
    this.filechooser.open().then((uri) => {

      this.filePath.resolveNativePath(uri).then(path => {
        let options = {
          uri: path,
          folderName: 'appBookImages',
          quality: 90,
          width: 1000,
          height: 1000
        } as ImageResizerOptions;
        this.imageResizer
          .resize(options)
          .then((filePath: string) => {
            this.saveImage(filePath);
          })
          .catch(e => console.log(e));
      }).catch(error => {
        alert(error);
      });
    });
  }
  saveImage(filePath){
    let loader = this.loadingCtrl.create({
      content: "Saving...",

    });
    loader.present();
    (<any>window).resolveLocalFileSystemURL(filePath, (res) => {
      var fileName = res.name;
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          var imageStore = firestore.ref('/usersPhotos/').child(fileName);
          imageStore.put(imgBlob).then((res) => {
            firestore.ref('/usersPhotos/').child(fileName).getDownloadURL().then((url) => {
             this.service.image=url;
             var user = this.service.getUserInfo();
            databaseRef.child(user.key).update({ "/image": url });
            loader.dismiss();
            });
            firestore.ref().child(fileName).getDownloadURL()
          }).catch((err) => {
            alert('Upload Failed' + err);
          });

        }
      });
    });
  }

}
