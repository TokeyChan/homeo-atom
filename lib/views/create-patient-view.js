'use babel';

import { TextEditor, File } from 'atom';

const fs = require('fs');
const path = require('path');

export default class CreatePatientView {

  constructor(serializedState) {
    this.firstname = null;
    this.lastname = null;
    this.gender = null;
    this.birthday = null;
    this.street = null;
    this.city = null;
    this.phone = null;

    this.create_html();
    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });
  }

  choose_gender(gender) {
    if (gender == 'male') {
      this.gender = 'male';
      this.male_button.classList.add('chosen_radio_button');
      this.female_button.classList.remove('chosen_radio_button');
    } else {
      this.gender = 'female';
      this.male_button.classList.remove('chosen_radio_button');
      this.female_button.classList.add('chosen_radio_button');
    }
  }

  open() {
    if (this.panel.isVisible())
        return;
    this.panel.show();
    this.nameEditor.element.focus();
  }

  close(save) {
    if (!this.panel.isVisible())
        return;
    if (save === true) {
      this.save();
    }
    this.panel.hide();
  }

  save() {
    this.firstname = this.nameEditor.getText();
    this.lastname = this.lastnameEditor.getText();
    this.birthday = this.birthdayEditor.getText();
    this.street = this.streetEditor.getText();
    this.city = this.cityEditor.getText();
    this.phone = this.phoneEditor.getText();

    let patients_file_path = path.join(atom.config.get('homeo-atom.patientRoot'), "patients.json");
    let raw_patients_data = fs.readFileSync(patients_file_path);
    let patients_data = JSON.parse(raw_patients_data);
    this.id = 0;
    if (patients_data['patients'].length > 0) {
      this.id = patients_data['patients'].length;
    }
    patients_data['patients'].push({
      'id': this.id,
      'name': this.firstname + " " + this.lastname,
      'dir_name': this.id + "-" + this.firstname + "_" + this.lastname
    });

    fs.writeFileSync(patients_file_path, JSON.stringify(patients_data, null, 4));


    let json_patient = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'gender': this.gender,
      'birthday': this.birthday,
      'street': this.street,
      'city': this.city,
      'phone': this.phone,
      'files': []
    };

    let patient_dir = path.join(atom.config.get('homeo-atom.patientRoot'), this.id + "-" + this.firstname + "_" + this.lastname);

    if (!fs.existsSync(patient_dir)) {
      fs.mkdirSync(patient_dir);
      fs.writeFileSync(path.join(patient_dir, "main.hom"), "");
      fs.writeFileSync(path.join(patient_dir, "temp.hom"), "");
    } else {
      atom.notifications.addWarning("Erstellung fehlgeschlagen.", {});
      return;
    }

    fs.writeFileSync(path.join(patient_dir, "data.json"), JSON.stringify(json_patient, null, 4));

    atom.notifications.addSuccess((this.gender == "male" ? "Patient" : "Patientin") + " wurde gespeichert!", {});
  }

  destroy() {}

  serialize() {}

  create_html() {
    let title_tag = document.createElement('div');
    title_tag.classList.add("title_tag");
    title_tag.textContent = "Neue/r PatientIn";

    let name_tag = document.createElement('div');
    name_tag.textContent = 'Vorname:';

    this.nameEditor = new TextEditor({ mini: true});

    let lastname_tag = document.createElement('div');
    lastname_tag.textContent = 'Nachname:';

    this.lastnameEditor = new TextEditor({ mini: true});

    let birthday_tag = document.createElement('div');
    birthday_tag.textContent = "Geburtstag:";

    this.birthdayEditor = new TextEditor({ mini: true, placeholderText: 'dd.mm.yyyy'});
    this.birthdayEditor.onWillInsertText((arg) => {
      if (arg.text.match(/[^\d .]/)) {
        arg.cancel();
      }
    });

    let gender_tag  = document.createElement('div');
    gender_tag.textContent = "Geschlecht:";

    this.male_button = document.createElement('input');
    this.male_button.type = "button";
    this.male_button.id = "male_button";
    this.male_button.classList.add('radio_button');
    this.male_button.value = "M";

    this.female_button = document.createElement('input');
    this.female_button.type = "button";
    this.female_button.id = "female_button";
    this.female_button.classList.add('radio_button');
    this.female_button.value = "W";

    let gender_div = document.createElement('div');
    gender_div.classList.add("radio_div");
    gender_div.appendChild(this.male_button);
    gender_div.appendChild(this.female_button);

    let street_tag = document.createElement('div');
    street_tag.textContent = "Straße:";

    this.streetEditor = new TextEditor({mini: true});

    let city_tag = document.createElement('div');
    city_tag.textContent = "PLZ und Ort:"

    this.cityEditor = new TextEditor({mini: true});

    let phone_tag = document.createElement('div');
    phone_tag.textContent = "Telefon:";

    this.phoneEditor = new TextEditor({mini: true});

    this.phoneEditor.onWillInsertText((arg) => {
      if (arg.text.match(/[^\d ()+]/)) {
        arg.cancel();
      }
    });

    let save_button = document.createElement('input');
    save_button.type = "button";
    save_button.id="save_button";
    save_button.classList.add('button');
    save_button.value = "Speichern";
    let close_button = document.createElement('input')
    close_button.type = "button";
    close_button.id="close_button";
    close_button.classList.add('button');
    close_button.value = "Abbrechen";

    let button_div = document.createElement('div');
    button_div.appendChild(save_button);
    button_div.appendChild(close_button);
    button_div.classList.add("input_div");


    this.element = document.createElement('div');
    this.element.id = "main";

    this.element.appendChild(title_tag);
    this.element.appendChild(name_tag);
    this.element.appendChild(this.nameEditor.element);
    this.element.appendChild(lastname_tag);
    this.element.appendChild(this.lastnameEditor.element);
    this.element.appendChild(birthday_tag);
    this.element.appendChild(this.birthdayEditor.element);
    this.element.appendChild(gender_tag);
    this.element.appendChild(gender_div);
    this.element.appendChild(street_tag);
    this.element.appendChild(this.streetEditor.element);
    this.element.appendChild(city_tag);
    this.element.appendChild(this.cityEditor.element);
    this.element.appendChild(phone_tag);
    this.element.appendChild(this.phoneEditor.element);

    this.element.appendChild(button_div);

    this.element.addEventListener("keydown", (event) => {
      if (event.keyCode === 27)
        this.close.bind(this, false);
    });


    save_button.addEventListener("click", this.close.bind(this, true));
    close_button.addEventListener("click", this.close.bind(this, false));
    this.male_button.addEventListener("click", this.choose_gender.bind(this, 'male'));
    this.female_button.addEventListener("click", this.choose_gender.bind(this, 'female'));

    let editors = [this.nameEditor.element, this.lastnameEditor.element, this.birthdayEditor.element, this.streetEditor.element, this.cityEditor.element, this.phoneEditor.element];
    for (let i = 0; i < editors.length; i++) {
      editors[i].addEventListener("keydown", function(event) {
        if (event.keyCode == 9) {
          event.preventDefault();
          let element = (i == editors.length - 1 ? editors[0] : editors[i + 1]);
          element.focus();
        }
      });
    }
  }
}
