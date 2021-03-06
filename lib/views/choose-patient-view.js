'use babel';

import { TextEditor } from 'atom';
import CreatePatientView from './create-patient-view';

const fs = require('fs');
const path = require('path');

export default class ChoosePatientView {

  constructor(manager) {
    this.manager = manager;

    let title_tag = document.createElement('div');
    title_tag.classList.add("title_tag");
    title_tag.textContent = "Patient öffnen";

    let search_div = document.createElement('div');
    this.txtSearch = new TextEditor({mini: true});
    search_div.appendChild(this.txtSearch.element);

    this.patient_container = document.createElement('div');
    this.patient_container.id = "patient_container";

    let raw_patients_data = fs.readFileSync(path.join(atom.config.get('homeo-atom.patientRoot'), "patients.json"));
    let patients_data = JSON.parse(raw_patients_data);

    patients_data['patients'].forEach((patient) => {
      let container = document.createElement('div');
      container.classList.add("container");
      let patient_div = document.createElement('div');
      patient_div.classList.add("patient_div");
      patient_div.textContent = patient['name'];
      container.appendChild(patient_div);
      patient_div.addEventListener('click', this.choose.bind(this, patient['dir_name']));

      let edit_div = document.createElement('div');
      edit_div.classList.add("edit_div");
      container.appendChild(edit_div);
      edit_div.addEventListener('click', this.edit.bind(this, patient['dir_name'], patient['id'])); // <- Da sollte es dann ein Edit Fenster öffnen

      let delete_div = document.createElement('div');
      delete_div.classList.add('delete_div');
      container.appendChild(delete_div);
      delete_div.addEventListener('click', this.delete.bind(this, patient['dir_name'], patient['id']));

      this.patient_container.appendChild(container);
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
    this.element.appendChild(search_div);
    this.element.appendChild(this.patient_container);
    this.element.appendChild(button_div);

    close_button.addEventListener('click', this.close.bind(this));

    this.txtSearch.element.addEventListener('keydown', event => {
      if (event.keyCode == 13) {
        let patients = this.patient_container.childNodes;
        let search_term = this.txtSearch.getText().toLowerCase();

        for (let i = 0; i < patients.length; i++) {
          if (patients[i].textContent.toLowerCase().includes(search_term)) {
            patients[i].style.display = "";
          } else {
            patients[i].style.display = "none";
          }
        }
      }
    });
    this.txtSearch.element.focus();


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

  edit(dir_name, id) {
    var data = JSON.parse(fs.readFileSync(path.join(atom.config.get('homeo-atom.patientRoot'), dir_name, "data.json")));
    data['new'] = false;
    data['id'] = id;
    var view = new CreatePatientView(data);
    view.open();
  }

  delete(dir_name, id) {
    
  }

  choose(dir_name) {
    this.close();
    atom.workspace.getPanes().forEach(pane => {
      pane.destroy();
    });

    var left_item = null;
    var right_item = null;

    var filename = path.join(atom.config.get('homeo-atom.patientRoot'), dir_name, "main.hom");

    atom.workspace.open("homeo-atom://" + path.join(atom.config.get('homeo-atom.patientRoot'), dir_name, "data.json"));

    var manager = this.manager;
    var view = this;
    atom.workspace.open(filename).then(
      function(result) {
        left_item = view.populate_editor(result);
        manager.left_item = left_item;
        let left_pane = atom.workspace.paneForItem(left_item);
        let right_pane = left_pane.splitRight();
        right_pane.activate();

        atom.workspace.open(filename).then(
          function(result) {
            manager.right_item = result;//view.populate_editor(result);
            manager.initializeEditors();
          }
        );
      }
    );
  }

  populate_editor(text_editor) {
    var buffer = text_editor.getBuffer();
    var uri = buffer.getPath();
    return text_editor;
  }

  destroy() {}

  serialize() {}
}
