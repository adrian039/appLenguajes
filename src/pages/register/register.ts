import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { service } from '../service/service';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

var auth;
var databaseRef;
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
	name="";
	username="";
	email="";
	password="";
	error: any
  auth: any
  userProfile: any = null;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, private service:service, 
    private facebook: Facebook, public plt: Platform,  private googlePlus: GooglePlus) {
  	var app=service.getApp();
    var database = app.database();
  	auth = app.auth();
  	databaseRef = database.ref().child("users");
  }

  fbSign(): void{
    if(this.plt.is('android')){
    this.facebook.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            this.showMsj('Data from facebook taked successfully! :)');
            this.userProfile = success;
            this.email=this.userProfile.email;
            this.name=this.userProfile.displayName;
        })
        .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
        });

    }).catch((error) => { console.log(error) });
  }else{
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

twitterLogin(): void{

}

googleLogin(): void{
	
}

regUser(): void{
	var data = {name: this.name, email: this.email, username:this.username, password:this.password};
	try{
	this.regUser1(this.email, this.password);
	 databaseRef.push().set(data);
	 this.showMsj('Sign In Complete! :)');
	}catch(error){
	this.showMsj('Sign In Error! :(');
	}
	 this.name="";
	 this.email="";
	 this.username="";
	 this.password="";
}

regUser1(email, pass): void{
  	
  	 auth.createUserWithEmailAndPassword(email, pass)
  	.then((authData) => {
  		//this.loginComplete();

  	}).catch((_error) => {
  		//this.errorLogin();
  	})
   // this.email='';
   // this.password='';

    
  }

 showMsj(msj): void{
    let toast = this.toastCtrl.create({
     message: msj,
     duration: 5000,
     position: 'middle'
    });
    toast.present();
  }

}
