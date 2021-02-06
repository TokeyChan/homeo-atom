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
    this.left_item.foldAll();
    this.patient_dir = path.dirname(this.left_item.getBuffer().getPath());

    this.patient_data = JSON.parse(fs.readFileSync(path.join(this.patient_dir, "data.json")));

    this.dates = [];
    this.current_session_date = null;

    let lines = this.left_item.getText().split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#")) {
        this.dates.push(lines[i].replace('#', ''));
      }
    }

    var manager = this;
    [this.left_item, this.right_item].forEach(item => {
      item.onDidChangeCursorPosition(event => {
        if(item.isFoldableAtBufferRow(item.getCursorBufferPosition().row)) {
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
    var editor = atom.workspace.getActiveTextEditor();
    var row = editor.getCursorBufferPosition().row;
    let row_content = editor.buffer.lineForRow(row);
    if ((/\S/.test(row_content)) || !row_content) {
      editor.insertNewlineBelow();
      editor.insertNewlineBelow();
      row += 2;
    }


    if (this.current_session_date == null) {
      let date = new Date();
      let datestring = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
      let timestring = date.getHours() + ":" + date.getMinutes();


      this.current_session_date = date;

      if (!this.dates.includes(datestring)) {
        this.dates.push(datestring);

        editor.setIndentationForBufferRow(row, 0);
        editor.setTextInBufferRange(new Range([row, 0], [row, datestring.length]), "#" + datestring);
        editor.insertNewlineBelow();
        editor.setIndentationForBufferRow(row + 1, 1);
        editor.setTextInBufferRange(new Range([row + 1, 1], [row + 1, timestring.length]), "|" + timestring);
        editor.insertNewlineBelow();
        editor.setIndentationForBufferRow(row + 2, 2);

        //editor.setCursorBufferPosition([row + 2, 2]);
      } else {
        editor.setIndentationForBufferRow(row, 1);
        editor.setTextInBufferRange(new Range([row, 1], [row, timestring.length]), "|" + timestring);
        editor.insertNewlineBelow();
        editor.insertNewlineBelow();
        editor.setIndentationForBufferRow(row + 2, 2);
        //editor.setCursorBufferPosition(row + 2, 2);
      }
    } else {
      let durationInSeconds = Math.abs(this.current_session_date - new Date()) / 1000;
      let minutes = Math.floor(durationInSeconds / 60);

      let result = minutes + " Minuten";

      editor.setTextInBufferRange(new Range([row, 1], [row, result.length]), result);
      editor.insertNewlineBelow();
      editor.setCursorBufferPosition(row + 1, 1);

      this.current_session_date = null;
    }
  }

  destroy() {
  }
}
