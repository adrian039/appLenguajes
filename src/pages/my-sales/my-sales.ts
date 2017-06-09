import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { service } from '../service/service';
import { LoadingController } from 'ionic-angular';
import { CategoryPage } from '../category/category';


var databaseRef;
var firestore;
@Component({
  selector: 'page-my-sales',
  templateUrl: 'my-sales.html',
})
export class MySalesPage {
  imgsource = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
  image1 = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
  image2 = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
  image3 = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
  name = "";
  language = "";
  autor = "";
  price = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
    private camera: Camera, private service: service, public loadingCtrl: LoadingController) {
    var app = service.getApp();
    var database = app.database();
    firestore = app.storage();
    databaseRef = database.ref().child('notifications');
  }

  takePhoto(image): void {
    this.camera.getPicture({
      quality: 90,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 800,
      saveToPhotoAlbum: true
    }).then((imageData) => {
      if (image == 'image1') {
        this.uploadImage(imageData, 'image1');
      } else if (image == 'image2') {
        this.uploadImage(imageData, 'image2');
      } else {
        this.uploadImage(imageData, 'image3');
      }
    }, (err) => {
      console.log(err);
    });
  }

  sell(): void {
    var cat = this.service.category;
    var scat = this.service.subCategory;
    this.geolocation.getCurrentPosition().then((resp) => {
      var data = {
        user: this.service.getUser(), name: this.name, autor: this.autor, language: this.language, price: this.price,
        latitude: resp.coords.latitude, longitude: resp.coords.longitude, image1: this.image1, image2: this.image2,
        image3: this.image3, state: 'active', category: cat, subCategory: scat, country: this.service.getUserInfo().child("country").val()
      };
      databaseRef.push().set(data);
      this.name = "";
      this.autor = "";
      this.language = "";
      this.price = "";
      this.image1 = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
      this.image2 = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
      this.image3 = "https://firebasestorage.googleapis.com/v0/b/base-58db2.appspot.com/o/systemFiles%2Fadd.png?alt=media&token=86c3af73-ef5c-4728-96da-c4f138c5f294";
      alert("New Book Alert Created! :)");
      this.service.category = 'Category';
      this.service.subCategory = 'SubCategory';
    }).catch((error) => {
      alert('Please activate your gps! :)');
      console.log('Error getting location', error);
    });
  }

  uploadImage(image, file) {
    let loader = this.loadingCtrl.create({
      content: "Loading Image...",

    });
    loader.present();
    (<any>window).resolveLocalFileSystemURL(image, (res) => {
      var fileName = res.name;
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          var imageStore = firestore.ref('/booksPhotos/').child(fileName);
          imageStore.put(imgBlob).then((res) => {
            firestore.ref('/booksPhotos/').child(fileName).getDownloadURL().then((url) => {
              if (file == 'image1') {
                this.image1 = url;
                loader.dismiss();
              } else if (file == 'image2') {
                this.image2 = url;
                loader.dismiss();
              } else {
                this.image3 = url;
                loader.dismiss();
              }
            });
            firestore.ref().child(fileName).getDownloadURL()
          }).catch((err) => {
            alert('Upload Failed' + err);
          });

        }
      });
    });
  }

  selectCat(type): void {
    if (type == 'category') {
      this.navCtrl.push(CategoryPage, { type: 'category' });
    } else {
      this.navCtrl.push(CategoryPage, { type: 'subCategory', source: this.service.category });
    }
  }

}
