import { Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import firebase from 'firebase';
import { service } from '../pages/service/service';
import {TabsPage} from '../pages/tabs/tabs';
import {SettingsPage} from '../pages/settings/settings';

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
    public translateService: TranslateService) {
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
    console.log('ola k ase');

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
    }else if(page=='settings'){
       this.nav.setRoot(SettingsPage);
    }
  }

}
