import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AboutPage} from '../about/about';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  constructor(public navCtrl: NavController) {
  }

  openChat(): void{
  this.navCtrl.popTo(AboutPage);
  	this.navCtrl.push(AboutPage);
  }

}
