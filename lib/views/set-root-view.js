'use babel';

import { TextEditor } from 'atom';

const path = require('path');
const fs = require('fs');

export default class SetRootView {

  constructor() {
    this.element = document.createElement('div');
    this.element.id = "main";

    let title_tag = document.createElement('div');
    title_tag.classList.add("title_tag");
    title_tag.textContent = "Homeo-Atom Ordner auswählen";

    this.rootEditor = new TextEditor({mini: true});

    let folder_browser = document.createElement('div');
    folder_browser.innerHTML = "<input id='folder_browser_dialog' type='file' directory webkitdirectory multiple>";


    let save_button = document.createElement('input');
    save_button.type = "button";
    save_button.id = "save_button";
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


    this.element.appendChild(title_tag);
    this.element.appendChild(folder_browser);
    this.element.appendChild(this.rootEditor.element);
    this.element.appendChild(button_div);

    save_button.addEventListener("click", this.close.bind(this, true));
    close_button.addEventListener("click", this.close.bind(this, false));
    let rootEditor = this.rootEditor;
    folder_browser.addEventListener("change", function(e) {
      rootEditor.setText(e.target.files[0].path);
    });

    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });
  }

  open() {

    if (this.panel.isVisible())
        return;
    this.panel.show();
    this.rootEditor.element.focus();
  }

  close(save) {
    if (!this.panel.isVisible())
        return;
    if (save === true) {
      atom.config.set('homeo-atom.Root', this.rootEditor.getText());
      atom.config.set('homeo-atom.patientRoot', path.join(this.rootEditor.getText(), "Patienten"));
      fs.mkdirSync(atom.config.get('homeo-atom.patientRoot'), {});
      let data = {'patients':[]}
      fs.writeFileSync(path.join(atom.config.get('homeo-atom.patientRoot'), "patients.json"), JSON.stringify(data, null, 4));
    }

    this.panel.hide();
  }

  destroy() {}

  serialize() {}
}
