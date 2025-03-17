export class Place{
    constructor(title, imageUri, location, id){
        this.title = title;
        this.imageUri = imageUri;
        this.address = location?.address;
        this.location = {latitude: location?.latitude, longitude: location?.longitude}; // location will be like {latitude: 0.141241, longitude: 127.121};
        // this.id = new Date().toString() + Math.random().toString(); // this will give us a unique number or say id 
        this.id = this.id;
    }
}