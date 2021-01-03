'use babel';

const fs = require('fs');

//import TextEditor from 'atom';
import CreatePatientView from './create-patient-view';

const patients_root = "/home/benjamin/homeo-atom/Patienten"

export default class PatientManager {
  constructor(serializedState) {
    if (!fs.existsSync(patients_root)) {
      fs.mkdirSync(patients_root, {});
    }
    this.patient_view = new CreatePatientView(null);
  }

  loadPatients() {
    let paths = atom.project.getPaths();
    if (!paths.includes(patients_root)) {
      atom.project.setPaths(['/home/benjamin/Code/atom-packages/homeo-atom', patients_root])
    }
  }

  createPatient() {
    this.patient_view.open();
  }
}
