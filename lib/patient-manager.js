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

    this.date_lines = [];
    this.dates = [];

    let lines = this.left_item.getText().split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#")) {
        this.date_lines.push(i);
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
      item.onDidSave(() => {
        let date_lines = [];
        let lines = item.buffer.getLines();
        for (let i = 0; i < lines.length; i++) {
          if(lines[i].startsWith('#')) {
            date_lines.push(i);
          }
        }
        for (let i = 0; i < date_lines.length; i++) {
          let date = item.buffer.lineForRow(i);
          let filename = date.split('-')[0].replace('.', '_').replace('.', '_').replace('#', '') + ".hom";

          let content = "";
          if (i != date_lines.length - 1) {
            content = item.getTextInRange(new Range([date_lines[i], 0], [date_lines[i + 1], 0]));
          } else {
            content = item.getTextInRange(new Range([date_lines[i], 0], [item.buffer.getLineCount(), 0]))
          }
          fs.writeFile(path.join(manager.patient_dir, filename), content, (result) => {
            console.log("supiii!");
          });
        }
        fs.writeFile(path.join(manager.patient_dir, "data.json"), JSON.stringify(manager.patient_data, null, 4), (result) => {console.log(result);})
      });
    });
  }

  newSession() {
    let date = new Date();
    let datestring = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
    let timestring = date.getHours() + ":" + date.getMinutes();

    let editor = atom.workspace.getActiveTextEditor();

    if (!this.dates.includes(datestring)) {
      this.dates.push(datestring);

      let filename = datestring.replace('.', '_').replace('.', '_') + ".hom";

      let date_row = editor.getCursorBufferPosition().row;

      if (editor.buffer.lineForRow(date_row).trim() !== "") {
        editor.insertNewlineBelow();
        editor.insertNewlineBelow();
        date_row += 2;
      }

      editor.setIndentationForBufferRow(date_row, 0);
      editor.setTextInBufferRange(new Range([date_row, 0], [date_row, datestring.length]), "#" + datestring);
      editor.insertNewlineBelow();
      editor.setIndentationForBufferRow(date_row + 1, 1);
      editor.setTextInBufferRange(new Range([date_row + 1, 1], [date_row + 1, timestring.length]), "|" + timestring);
      editor.insertNewlineBelow();
      editor.setIndentationForBufferRow(date_row + 2, 2);

      editor.setCursorBufferPosition([date_row + 2, 2]);

      this.date_lines.push(date_row);

      var manager = this;
      fs.writeFile(path.join(this.patient_dir, filename), datestring, (result) => {
        manager.patient_data['files'].push(filename);
      });
    } else {
      let time_row = editor.getCursorBufferPosition().row;
      if (editor.buffer.lineForRow().trim() !== "") {
        editor.insertNewlineBelow();
        editor.insertNewlineBelow();
        time_row += 2;
      }
      editor.setIndentationForBufferRow(time_row, 1);
      editor.setTextInBufferRange(new Range([time_row, 1], [time_row, timestring.length]), "|" + timestring);
      editor.insertNewlineBelow();
      editor.insertNewlineBelow();
    }
  }

  destroy() {
  }
}
