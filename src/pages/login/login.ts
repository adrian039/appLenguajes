import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { AlertController } from 'ionic-angular';
import { AdminPage } from '../admin/admin';

var auth;
var users;
var databaseRef;
var i;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email = "";
  password = "";
  error: any
  auth: any
  users = [];
  userProfile: any = null;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service: service,
    private facebook: Facebook, public plt: Platform, private googlePlus: GooglePlus, private alertCtrl: AlertController) {

    users = [];
    var app = service.getApp();
    auth = app.auth();
    var database = app.database();
    databaseRef = database.ref().child("users");
    databaseRef.on("child_added", function (snapshot) {
      users.push(snapshot);
    });
    this.service.setUsers(users);
  }

  googleLogin(): void {
    if (this.plt.is('android')) {
      this.googlePlus.login({
        'webClientId': '<Your web client ID>',
        'offline': true
      }).then(res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(success => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.loginComplete();
            this.navCtrl.push(TabsPage);
          })
          .catch(error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
    } else {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((authData) => {
          this.loginComplete();
          this.navCtrl.push(TabsPage);
        }).catch((_error) => {
          this.errorLogin();
        })
    }
  }


  fbLogin(): void {
    if (this.plt.is('android')) {
      this.facebook.login(['email']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            this.loginComplete();
            this.setUsername(success.email);
            this.userProfile = success;
            this.navCtrl.push(TabsPage);
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });

      }).catch((error) => { console.log(error) });
    } else {
      auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then((authData) => {
          this.loginComplete();
          this.navCtrl.push(TabsPage);
        }).catch((_error) => {
          alert(_error);
          this.errorLogin();
        })
    }
  }

  twitterLogin(): void {
    firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
      .then((authData) => {
        this.loginComplete();

      }).catch((_error) => {
        this.errorLogin();
      })
  }

  loginUser() {
    var cont = 0
    var flag = false;
    while (cont < this.service.getUsers().length) {
      var user = this.service.getUsers()[cont].child("email").val();
      var pass = this.service.getUsers()[cont].child("password").val();
      if ((this.email == user) && (this.password == pass)) {
        flag = true;
        break;
      } else {
        cont = cont + 1;
      }
    }
    if (flag) {
      this.setUsername(this.email);
      this.loginComplete();
      this.navCtrl.push(TabsPage);
    } else {
      let toast = this.toastCtrl.create({
        message: 'Wrong email or password :(',
        duration: 5000,
        position: 'middle'
      });
      toast.present();
    }
  }

  regUser(): void {
    this.navCtrl.push(RegisterPage);

  }

  loginComplete(): void {
    let toast = this.toastCtrl.create({
      message: 'Login successfully :)',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  errorLogin(): void {
    let toast = this.toastCtrl.create({
      message: 'User was not added, User already exist! :( ',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  showMsj(msj): void {
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3500,
      position: 'middle'
    });
    toast.present();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      message: 'Enter the admin password',
      inputs: [

        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
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
          text: 'Login',
          handler: data => {
            if (data.password == 'lenguajes2017') {
              this.navCtrl.push(AdminPage);
            } else {
              this.showMsj('Wrong admin password! :(');
            }
          }
        }
      ]
    });
    alert.present();
  }

  setUsername(email): void {
    var cont = this.service.users.length;
    var username = "";
    for (i = 0; i < cont; i++) {
      var user = this.service.getUsers()[i];
      if (user.child("email").val() == email) {
        this.service.setUserInfo(user);
        username = user.child("username").val();
        break;
      }
    }
    this.service.setUser(username);
    this.email = '';
    this.password = '';
    console.log("Username: " + this.service.getUser());
  }




}