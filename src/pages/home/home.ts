import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import firebase from 'firebase';

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
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service:service) {
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
