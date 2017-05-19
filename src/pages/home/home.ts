import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { ToastController } from 'ionic-angular';

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
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service:service, private facebook: Facebook) {
  		var app=service.getApp();
  		auth = app.auth();
  }

  googleLogin(): void{
  		auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  		.then((authData) => {
  		let toast = this.toastCtrl.create({
     message: 'Login successfully :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();

  	}).catch((_error) => {
  		let toast = this.toastCtrl.create({
     message: 'User was not added, User already exist! :( ',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  	})
  }

  facebookLogin(): void{
  		 auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  		 .then((authData) => {
  		let toast = this.toastCtrl.create({
     message: 'Login successfully :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();

  	}).catch((_error) => {
  		let toast = this.toastCtrl.create({
     message: 'User was not added, User already exist! :( ',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  	})
  }

  fbLogin(){
    this.facebook.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            console.log("Firebase success: " + JSON.stringify(success));
            let toast = this.toastCtrl.create({
     message: 'Login successfully :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
            this.userProfile = success;
        })
        .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
        });

    }).catch((error) => { console.log(error) });
}

  twitterLogin(): void{
firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
.then((authData) => {
      let toast = this.toastCtrl.create({
     message: 'Login successfully :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();

    }).catch((_error) => {
      let toast = this.toastCtrl.create({
     message: 'User was not added, User already exist! :( ',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
    })
  }

  regUser(): void{
  	
  	 auth.createUserWithEmailAndPassword(this.email, this.password)
  	.then((authData) => {
  		let toast = this.toastCtrl.create({
     message: 'User was added successfully! :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();

  	}).catch((_error) => {
  		let toast = this.toastCtrl.create({
     message: 'User was not added, User already exist! :( ',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  	})
    this.email='';
    this.password='';

    
  }

  loginUser(){
  	auth.signInWithEmailAndPassword(this.email, this.password)
  	.then((authData) => {
  	let toast = this.toastCtrl.create({
     message: 'Login successfully :)',
     duration: 5000,
     position: 'middle'
    });
    toast.present();
    //this.navCtrl.push(AboutPage);
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

  logOut(): void{
  }

 

}
