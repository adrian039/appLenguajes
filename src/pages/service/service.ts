import firebase from 'firebase';


export class service {

    app: firebase.app.App;
    username: string;
    users: any;
    name: any;
    email: any;
    country: any;
    address: any;
    phone: any;
    userinfo: any;
    image: any;
    category: any;
    subCategory: any;
    notifications: any;
    filters: any;
    latitude: any;
    longitude: any

    constructor() {
        this.app = null;
        this.username = "";
        this.name = "";
        this.email = "";
        this.country = "";
        this.address = "";
        this.phone = "";
        this.image = "";
        this.notifications = "";
        this.userinfo = [];
        this.category = 'Category';
        this.subCategory = 'SubCategory';
    }

    setApp(app) {
        this.app = app;
    }

    getApp() {
        return this.app;
    }

    setUser(user) {
        this.username = user;
    }

    getUser() {
        return this.username;
    }

    setUsers(data) {
        this.users = data;
    }

    getUsers() {
        return this.users;
    }

    setFilters(data) {
        this.filters = data;
    }

    getFilters() {
        return this.filters;
    }

    setUserInfo(info) {
        this.userinfo = info;
        this.name = info.child('name').val();
        this.email = info.child('email').val();
        this.country = info.child('country').val();
        this.address = info.child('address').val();
        this.phone = info.child('phone').val();
        this.image = info.child('image').val();
        this.notifications = info.child('notifications').val();
    }

    getUserInfo() {
        return this.userinfo;
    }

}

