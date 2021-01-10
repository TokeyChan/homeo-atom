'use babel';

const fs = require('fs');

//import TextEditor from 'atom';
import CreatePatientView from './views/create-patient-view';
import SetRootView from './views/set-root-view';

import { TextEditor, Disposable, CompositeDisposable } from 'atom';

const patients_root = atom.config.get('homeo-atom.patientRoot');

export default class PatientManager {

  constructor(serializedState) {
    if (!fs.existsSync(patients_root)) {
      fs.mkdirSync(patients_root, {});
    }
    this.patient_view = new CreatePatientView(null);
    this.subscriptions = null;

    this.left_item = null;
    this.right_item = null;
  }

  initialize() {
    let paths = atom.project.getPaths();
    if (!paths.includes(patients_root)) {
      atom.project.setPaths(['/home/benjamin/Code/atom-packages/homeo-atom', patients_root]); //hier dan eventually nur den patients_root, wenn überhaupt!!!
    }

    //this.openPatient();
  }

  createPatient() {
    this.patient_view.open();
  }

  openPatient() {
    // Patient auswählen und dann:

    atom.workspace.getPanes().forEach(pane => {
      pane.destroy();
    });
    var left_item = null;
    var right_item = null;

    var manager = this;

    atom.workspace.open('/home/benjamin/homeo-atom/Patienten/Testpatient/test.txt').then(
      function(result) {
        left_item = result;
        manager.left_item = left_item;
        let left_pane = atom.workspace.paneForItem(left_item);
        let right_pane = left_pane.splitRight();
        right_pane.activate();

        atom.workspace.open('/home/benjamin/homeo-atom/Patienten/Testpatient/test.txt').then(
          function(result) {
            manager.right_item = result;
            manager.initializeEditors();
          }
        );
      }
    );

  }

  initializeEditors() {
    console.log(this.right_item);
    console.log(this.left_item);
  }

  destroy() {
  }
}
