'use babel';

const fs = require('fs');
const path = require('path');

export default class PatientDataView {

  constructor(uri) {
    // Create root element
    this.uri = uri;
    this.patient_data = JSON.parse(fs.readFileSync(path.join(path.dirname(uri).split("://")[1], "data.json")));

    this.element = document.createElement('div');


    let split_date = this.patient_data['birthday'].split(".");
    let birthdate = new Date(split_date[2], split_date[1], split_date[0]);

    let current_year = new Date().getFullYear();

    let age = current_year - birthdate.getFullYear();


    // Create message element
    const message = document.createElement('div');
    message.innerHTML = "Name: " + this.patient_data['firstname'] + " " + this.patient_data['lastname'] + "<br>";
    message.innerHTML += "Alter: " + age + "<br>";
    message.innerHTML += "Geburtstag: " + birthdate.getDate() + "." + birthdate.getMonth() + 1 + "." + birthdate.getFullYear() + "<br>";
    message.innerHTML += "Geschlecht: " + (this.patient_data['gender'] == 'male' ? "Männlich" : "Weiblich") + "<br>";
    message.innerHTML += "Straße: " + this.patient_data['street'] + "<br>";
    message.innerHTML += "Stadt: " + this.patient_data['city'] + "<br>";
    message.innerHTML += "Telefonnummer: " + this.patient_data['phone'] + "<br>";

    //message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return "Test";
  }

  getURI() {
    return this.uri;
  }

  getDefaultLocation() {
    return "left";
  }

}
