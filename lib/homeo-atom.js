'use babel';

const fs = require('fs');
const root = '/home/benjamin/homeo-atom';

import PatientManager from './patient-manager'; 
import { CompositeDisposable } from 'atom';

export default {

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
        'homeo-atom:new_patient': () => this.newPatient()
      }),
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
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, {});
  }
}
