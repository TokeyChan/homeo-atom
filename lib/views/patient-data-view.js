'use babel';

const fs = require('fs');
const path = require('path');

export default class PatientDataView {

  constructor(uri) {
    // Create root element
    this.uri = uri;
    this.patient_data = JSON.parse(fs.readFileSync(path.join(path.dirname(uri).split("://")[1], "data.json")));

    this.element = document.createElement('div');

    var in_months = false;
    let split_date = this.patient_data['birthday'].split(".");
    let birthdate = new Date(split_date[2], split_date[1], split_date[0]);

    let diff_ms = Date.now() - birthdate.getTime();
    let age_dt = new Date(diff_ms);

    var age =  Math.abs(age_dt.getUTCFullYear() - 1970);
    if (age <= 2) {
      let diffMonths = Math.ceil(diff_ms / (1000 * 60 * 60 * 24 * 30));
      age = diffMonths;
      in_months = true;
    }

    // Create message element
    const message = document.createElement('div');
    message.id = "patient_data";
    message.innerHTML = "Name: " + this.patient_data['firstname'] + " " + this.patient_data['lastname'] + "<br>";
    message.innerHTML += "Alter: " + age + (in_months ? " Monate" : "") + "<br>";
    message.innerHTML += "Geburtstag: " + birthdate.getDate() + "." + birthdate.getMonth() + "." + birthdate.getFullYear() + "<br>";
    message.innerHTML += "Geschlecht: " + (this.patient_data['gender'] == 'male' ? "Männlich" : "Weiblich") + "<br>";
    message.innerHTML += "Straße: " + this.patient_data['street'] + "<br>";
    message.innerHTML += "Stadt: " + this.patient_data['city'] + "<br>";
    message.innerHTML += "Telefonnummer: " + this.patient_data['phone'] + "<br>";
    message.innerHTML += "Email-Adresse: " + this.patient_data['email'] + "<br>";

    let button_div = document.createElement("div");
    button_div.classList.add('input_div');

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
