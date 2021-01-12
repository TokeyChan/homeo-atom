'use babel';

import { TextEditor } from 'atom';

const fs = require('fs');
const path = require('path');

export default class ChoosePatientView {

  constructor(manager) {
    this.manager = manager;

    let title_tag = document.createElement('div');
    title_tag.classList.add("title_tag");
    title_tag.textContent = "Patient öffnen";

    let patient_container = document.createElement('div');
    patient_container.id = "patient_container";

    let raw_patients_data = fs.readFileSync(path.join(atom.config.get('homeo-atom.patientRoot'), "patients.json"));
    let patients_data = JSON.parse(raw_patients_data);

    patients_data['patients'].forEach((patient) => {
      let patient_div = document.createElement('div');
      patient_div.classList.add("patient_div");
      patient_div.textContent = patient['name'];
      patient_container.appendChild(patient_div);
      patient_div.addEventListener('click', this.choose.bind(this, patient['dir_name']));
    });

    let close_button = document.createElement('input')
    close_button.type = "button";
    close_button.id="close_button";
    close_button.classList.add('button');
    close_button.value = "Abbrechen";

    let button_div = document.createElement('div');
    button_div.appendChild(close_button);
    button_div.classList.add("input_div");


    this.element = document.createElement('div');
    this.element.appendChild(title_tag);
    this.element.appendChild(patient_container);
    this.element.appendChild(button_div);

    close_button.addEventListener('click', this.close.bind(this));

    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });
  }

  open() {
    if (this.panel.isVisible())
        return;
    this.panel.show();
  }

  close() {
    this.panel.hide();
  }

  choose(dir_name) {
    this.close();
    atom.workspace.getPanes().forEach(pane => {
      pane.destroy();
    });
    var left_item = null;
    var right_item = null;


    var filename = path.join(atom.config.get('homeo-atom.patientRoot'), dir_name, "main.hom");

    var manager = this.manager;

    atom.workspace.open(filename).then(
      function(result) {
        left_item = result;
        manager.left_item = left_item;
        let left_pane = atom.workspace.paneForItem(left_item);
        let right_pane = left_pane.splitRight();
        right_pane.activate();

        atom.workspace.open(filename).then(
          function(result) {
            manager.right_item = result;
            manager.initializeEditors();
          }
        );
      }
    );
  }

  destroy() {}

  serialize() {}
}
