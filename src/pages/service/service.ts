import firebase from 'firebase';


export class service {  
 
    app: firebase.app.App; 
     username:string;

    constructor() {
        this.app=null;
        this.username="";
    }
 
    setApp(app) {
        this.app=app;
    }
 
    getApp() {
        return this.app;
    }   

     setUser(user) {
        this.username=user;
    }
 
    getUser() {
        return this.username;
    }   
}
 
