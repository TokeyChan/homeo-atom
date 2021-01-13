'use babel';

const fs = require('fs');
const path = require('path');

//import TextEditor from 'atom';
import CreatePatientView from './views/create-patient-view';
import ChoosePatientView from './views/choose-patient-view';

import { TextEditor, Disposable, CompositeDisposable } from 'atom';

const patients_root = atom.config.get('homeo-atom.patientRoot');

export default class PatientManager {

  constructor(serializedState) {
    if (atom.config.get('homeo-atom.Root') != "" && !fs.existsSync(patients_root)) {
      fs.mkdirSync(patients_root, {});
      let data = {'patients':[]}
      fs.writeFileSync(path.join(patients_root, "patients.json"), JSON.stringify(data, null, 4));
    }
    this.subscriptions = null;

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
    this.right_item.foldAll();
    console.log(this.left_item);
  }

  destroy() {
  }
}
