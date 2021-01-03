'use babel';

import { TextEditor } from 'atom';

export default class CreatePatientView {

  constructor(serializedState) {

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
    birthday_tag.textContent = 'Geburtstag:';

    let birthday_picker = document.createElement('div');
    birthday_picker.classList.add("input_div");
    birthday_picker.innerHTML = "<input type='date' id='birthdaytime'>";

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
    this.element.appendChild(birthday_picker);
    this.element.appendChild(button_div);


    document.addEventListener("keydown", event => {
      if (event.keyCode === 13)
        this.close.bind(this);
    });

    save_button.addEventListener("click", this.close.bind(this, true));
    close_button.addEventListener("click", this.close.bind(this, false));


    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });
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
      console.log("Hier Speichern");
    }
  }

  destroy() {}

  serialize() {}
}
