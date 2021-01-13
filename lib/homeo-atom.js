'use babel';

const fs = require('fs');
const path = require('path');

import PatientManager from './patient-manager';
import SetRootView from './views/set-root-view';
import { CompositeDisposable, TextEditor, TextBuffer, Range } from 'atom';

export default {

  config:  {
    "Root": {
      'type': 'string',
      'default': ''
    },
    "patientRoot": {
      'type': 'string',
      'default': ''
    }
  },
  subscriptions: null,
  manager: null,
  activated: false,

  initialize(state) {

    createRootIfNotExists();
  },

  activate(state) {
    this.manager = new PatientManager(state);
    this.subscriptions = new CompositeDisposable(
      atom.commands.add('atom-workspace', {
        'homeo-atom:toggle': () => this.toggle(),
        'homeo-atom:new_patient': () => this.newPatient(),
        'homeo-atom:open_patient': () => this.manager.openPatient()
      }),

      atom.workspace.addOpener(uri => {
        if (uri.split('.')[uri.split('.').length - 1] == "hom") {
          let buffer = new TextBuffer(); //TextBuffer.load(uri).then((buffer) => {
          let patient_data = JSON.parse(fs.readFileSync(path.join(path.dirname(uri), "data.json")));
          let line_height = 0;
          let fold_points = [];

          for (let i = 0; i < patient_data['files'].length; i++) {
            let raw_content = fs.readFileSync(path.join(path.dirname(uri), patient_data['files'][i]));
            let content = new TextDecoder().decode(raw_content).split("\n");

            let date = content[0];
            content.shift();

            buffer.append(date + "\n");
            buffer.append(content.join("\n"));
            buffer.append("\n\n");
            fold_points.push([[line_height + 1, 0], [line_height + content.length + 2, 0]]);
            line_height += content.length;
          }
          let text_editor = new TextEditor({'buffer':buffer});

          for (let i = 0; i < fold_points.length; i++) {
            text_editor.setCursorBufferPosition(fold_points[i][1]);
            text_editor.addSelectionForBufferRange(new Range(fold_points[i][0], fold_points[i][1]));
            text_editor.indentSelectedRows();
          }
          //text_editor.setCursorBufferPosition([0, 0]);
          buffer.setPath("Test"); // <- Steht dann oben. Wirft leider Fehler

          return text_editor;
        }
      }) //Kein ;
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    if (this.activated === true) {
      this.manager.destroy();
      atom.notifications.addWarning("Homeo-Atom wurde deaktiviert!", {});
      this.activated = false;
    } else {
      if (atom.config.get('homeo-atom.Root') == "") {
        let set_root = new SetRootView();
        set_root.open();
      }
      this.manager.initialize();
      atom.notifications.addSuccess("Homeo-Atom wurde aktiviert!", {});
      this.activated = true;
    }
  },

  newPatient() {
    this.manager.createPatient();
  },
};

function createRootIfNotExists() {
  let root = atom.config.get('homeo-atom.Root');
  if (root == "" || root == null)
      return;
  try {
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, {});
    }
  }
  catch (e){
    atom.notifications.addFatalError("Root Folder '" + root + "' konnte nicht erstellt werden.", {})
  }
}
