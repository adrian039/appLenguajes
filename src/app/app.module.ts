import { Http } from '@angular/http';
import { 
  TranslateModule, 
  TranslateStaticLoader, 
  TranslateLoader } from 'ng2-translate/ng2-translate';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//import { TranslateModule } from 'ng2-translate';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import {RegisterPage} from '../pages/register/register';
import {AdminPage} from '../pages/admin/admin';
import {SCategoryPage} from '../pages/s-category/s-category';
import {NewNotificationPage} from '../pages/new-notification/new-notification';
import {MySalesPage} from '../pages/my-sales/my-sales';
import {CategoryPage} from '../pages/category/category';
import {SettingsPage} from '../pages/settings/settings';
import { FileChooser } from '@ionic-native/file-chooser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { ImageResizer } from '@ionic-native/image-resizer';
import { Geolocation } from '@ionic-native/geolocation';
import { PhotoViewer } from '@ionic-native/photo-viewer';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ChatPage,
    TabsPage, 
    LoginPage,
    RegisterPage,
    AdminPage,
    SCategoryPage,
    NewNotificationPage,
    MySalesPage,
    CategoryPage,
    SettingsPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [Http]
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    ChatPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    AdminPage,
    SCategoryPage,
    NewNotificationPage,
    MySalesPage,
    CategoryPage,
    SettingsPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    FileChooser,
    File,
    FilePath,
    Camera, 
    ImageResizer,
    Geolocation,
    PhotoViewer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}