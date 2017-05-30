import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { service } from '../service/service';
import { LoadingController } from 'ionic-angular';

var databaseRef;
var firestore;
@Component({
  selector: 'page-new-notification',
  templateUrl: 'new-notification.html',
})
export class NewNotificationPage {
  image = "";
  title = "";
  message = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private filechooser: FileChooser,
    private filePath: FilePath, private imageResizer: ImageResizer, private service: service, public loadingCtrl: LoadingController) {
    var app = service.getApp();
    var database = app.database();
    firestore = app.storage();
    databaseRef = database.ref().child("notifications");
  }

  getImage(): void {
    this.filechooser.open().then((uri) => {

      this.filePath.resolveNativePath(uri).then(path => {
        let options = {
          uri: path,
          folderName: 'appBookImages',
          quality: 100,
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

  sendNotification(): void {
    let loader = this.loadingCtrl.create({
      content: "Creating Notification...",

    });
    loader.present();
    (<any>window).resolveLocalFileSystemURL(this.image, (res) => {
      var fileName = res.name;
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          var imageStore = firestore.ref('/notificationImages/').child(fileName);
          imageStore.put(imgBlob).then((res) => {
            firestore.ref('/notificationImages/').child(fileName).getDownloadURL().then((url) => {
              var data = { user: 'admin', title: this.title, message: this.message, image: url }
              databaseRef.push().set(data);
              loader.dismiss();
              alert('Notification has been created :)');
              this.image = "";
              this.title = "";
              this.message = "";

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



