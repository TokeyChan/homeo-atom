'use babel';

import { TextEditor } from 'atom';

const fs = require('fs');

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
    if (this.panel.isVisible() || !atom.workspace.getActiveTextEditor())
        return;
    this.panel.show();
    this.nameEditor.element.focus();
  }

  close(save) {
    if (!this.panel.isVisible())
        return;
    this.panel.hide();
    if (save === true) {
      save();
    }
  }

  save() {
    this.firstname = this.nameEditor.getText();
    this.lastname = this.lastnameEditor.getText();
    this.birthday = Date.parse(this.birthdayEditor.getText());
    this.street = this.streetEditor.getText();
    this.city = this.cityEditor.getText();
    this.phone = this.phoneEditor.getText();

    let json_patient = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'birthday': this.birthday,
      'street': this.street,
      'city': this.city,
      'phone': this.phone
    };
  /*
    if (!fs.existsSync(patients_root)) {
      fs.mkdirSync(patients_root, {});
    }
  */
  }

  destroy() {}

  serialize() {}

  create_html() {
    let title_tag = document.createElement('div');
    title_tag.id = "title_tag";
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

    document.addEventListener("keydown", function(event) {
      if (event.keyCode === 13)
        this.close.bind(this, true);
      else if (event.keyCode === 27)
        this.close.bind(this, false);
    });


    save_button.addEventListener("click", this.close.bind(this, true));
    close_button.addEventListener("click", this.close.bind(this, false));
    this.male_button.addEventListener("click", this.choose_gender.bind(this, 'male'));
    this.female_button.addEventListener("click", this.choose_gender.bind(this, 'female'));
  }
}
