'use babel';

const fs = require('fs');
const path = require('path');

//import TextEditor from 'atom';
import CreatePatientView from './views/create-patient-view';
import ChoosePatientView from './views/choose-patient-view';

import { TextEditor, Disposable, CompositeDisposable, Range } from 'atom';

const patients_root = atom.config.get('homeo-atom.patientRoot');

export default class PatientManager {

  constructor(serializedState) {
    if (atom.config.get('homeo-atom.Root') != "" && !fs.existsSync(patients_root)) {
      fs.mkdirSync(patients_root, {});
      let data = {'patients':[]}
      fs.writeFileSync(path.join(patients_root, "patients.json"), JSON.stringify(data, null, 4));
    }
    this.subscriptions = new CompositeDisposable(
      atom.commands.add('atom-text-editor', {
        'homeo-atom:new_session': () => this.newSession()
      })
    );

    this.left_item = null;
    this.right_item = null;


  }

  initialize() {

  }

  createPatient() {
    patient_view = new CreatePatientView(null);
    patient_view.open();
  }

  openPatient() {
    choose_patient_view = new ChoosePatientView(this);
    choose_patient_view.open();
  }

  initializeEditors() {
    console.log(this.right_item);
    this.left_item.foldAll();
    console.log(this.left_item);

    let date_lines = [];
    let lines = this.left_item.getText().split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#")) {
        date_lines.push(i);
      }
    }

    [this.left_item, this.right_item].forEach(item => {
      item.onDidChangeCursorPosition(event => {
        if(date_lines.includes(event.newBufferPosition.row)) {
          if (item.isFoldedAtCursorRow()) {
            item.unfoldCurrentRow();
          } else {
            item.foldCurrentRow();
          }
        }
      });
    });
  }

  newSession() {
    let date = new Date();
    let datestring = date.toLocaleString();

    let editor = atom.workspace.getActiveTextEditor();
    let date_row = editor.getCursorBufferPosition().row;

    editor.setIndentationForBufferRow(date_row, 0);
    editor.setTextInBufferRange(new Range([date_row, 0], [date_row, datestring.length]), datestring);

    editor.insertNewlineBelow();
    editor.insertNewlineBelow();

    editor.setCursorBufferPosition([date_row + 2, 2]);
  }

  destroy() {
  }
}
