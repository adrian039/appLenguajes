import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

var auth;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	email="";
	password="";
	error: any
  auth: any
  userProfile: any = null;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service:service, 
    private facebook: Facebook, public plt: Platform,  private googlePlus: GooglePlus) {
  		var app=service.getApp();
  		auth = app.auth();
  }

  googleLogin(): void{ 
    if(this.plt.is('android')){
         this.googlePlus.login({
    'webClientId': '<Your web client ID>',
    'offline': true
  }).then( res => {
    firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then( success => {
        console.log("Firebase success: " + JSON.stringify(success));
        this.loginComplete();
      })
      .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
    }).catch(err => console.error("Error: ", err));
    }else{
  		auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  		.then((authData) => {
  		this.loginComplete();

  	}).catch((_error) => {
  		this.errorLogin();
  	})
  }
  }

 
  fbLogin(): void{
    if(this.plt.is('android')){
    this.facebook.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            this.loginComplete();
            this.userProfile = success;
        })
        .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
        });

    }).catch((error) => { console.log(error) });
  }else{
    auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
       .then((authData) => {
      this.loginComplete();
    }).catch((_error) => {
      this.errorLogin();
    })
  }
}

  twitterLogin(): void{
firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
.then((authData) => {
     this.loginComplete();

    }).catch((_error) => {
     this.errorLogin();
    })
  }

  regUser(): void{
  	
  	 auth.createUserWithEmailAndPassword(this.email, this.password)
  	.then((authData) => {
  		this.loginComplete();

  	}).catch((_error) => {
  		this.errorLogin();
  	})
    this.email='';
    this.password='';

    
  }

  loginUser(){
  	auth.signInWithEmailAndPassword(this.email, this.password)
  	.then((authData) => {
  	this.loginComplete();
  	}).catch((_error) => {
  		let toast = this.toastCtrl.create({
     message: 'Wrong email or password :(',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  	})
    this.service.setUser(this.email);
  	this.email='';
    this.password='';
  }

  loginComplete(): void{
    let toast = this.toastCtrl.create({
     message: 'Login successfully :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  }

  errorLogin(): void{
    let toast = this.toastCtrl.create({
     message: 'User was not added, User already exist! :( ',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  }

 

}
