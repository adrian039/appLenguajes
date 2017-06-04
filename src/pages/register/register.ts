import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { service } from '../service/service';
import { LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

var auth;
var databaseRef;
var firestore;
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  name = "";
  username = "";
  email = "";
  password = "";
  country = "";
  phone = "";
  address = "";
  image = "";
  error: any
  auth: any
  userProfile: any = null;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service: service,
    private facebook: Facebook, public plt: Platform, private googlePlus: GooglePlus, private filechooser: FileChooser,
    private filePath: FilePath, private imageResizer: ImageResizer, public loadingCtrl: LoadingController) {
    var app = service.getApp();
    var database = app.database();
    auth = app.auth();
    firestore = app.storage();
    databaseRef = database.ref().child("users");
  }

  fbSign(): void {
    if (this.plt.is('android')) {
      this.facebook.login(['email']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            this.showMsj('Data from facebook taked successfully! :)');
            this.userProfile = success;
            this.email = this.userProfile.email;
            this.name = this.userProfile.displayName;
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });

      }).catch((error) => { console.log(error) });
    } else {
      /* auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then((authData) => {
       this.signComplete();
        this.navCtrl.push(TabsPage);
       }).catch((_error) => {
         alert(_error);
        this.errorSign();
       })*/
    }
  }

  twitterLogin(): void {

  }

  googleLogin(): void {

  }

  regUser(): void {
    let loader = this.loadingCtrl.create({
      content: "Creating User Account...",

    });
    loader.present();
    (<any>window).resolveLocalFileSystemURL(this.image, (res) => {
      var fileName = res.name;
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          var imageStore = firestore.ref('/usersPhotos/').child(fileName);
          imageStore.put(imgBlob).then((res) => {
            firestore.ref('/usersPhotos/').child(fileName).getDownloadURL().then((url) => {
              var data = {
                name: this.name, email: this.email, username: this.username, password: this.password,
                address: this.address, country: this.country, phone: this.phone, image: url
              };
              try {
                loader.dismiss();
                this.regUser1(this.email, this.password);
                databaseRef.push().set(data);
                this.showMsj('Sign In Complete! :)');
              } catch (error) {
                this.showMsj('Sign In Error! :(');
              }
              this.name = "";
              this.email = "";
              this.username = "";
              this.password = "";
              this.country = "";
              this.phone = "";
              this.address = "";
              this.image = "";

            });
            firestore.ref().child(fileName).getDownloadURL()
          }).catch((err) => {
            alert('Upload Failed' + err);
          });

        }
      });
    });

  }

  regUser1(email, pass): void {

    auth.createUserWithEmailAndPassword(email, pass)
      .then((authData) => {
        //this.loginComplete();

      }).catch((_error) => {
        //this.errorLogin();
      })
    // this.email='';
    // this.password='';


  }

  showMsj(msj): void {
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 5000,
      position: 'middle'
    });
    toast.present();
  }

  getImage(): void {
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
            this.image = filePath;
          })
          .catch(e => console.log(e));
      }).catch(error => {
        alert(error);
      });
    });
  }

}
