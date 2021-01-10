'use babel';

const fs = require('fs');
const path = require('path');

import PatientManager from './patient-manager';
import SetRootView from './views/set-root-view';
import { CompositeDisposable } from 'atom';

export default {

  config:  {
    "Root": {
      'type': 'string',
      'default': ''
    }
  },
  subscriptions: null,
  manager: null,
  activated: false,

  initialize(state) {

    //createRootIfNotExists();
  },

  activate(state) {
    this.manager = new PatientManager(state);
    this.subscriptions = new CompositeDisposable(
      atom.commands.add('atom-workspace', {
        'homeo-atom:toggle': () => this.toggle(),
        'homeo-atom:new_patient': () => this.newPatient(),
        'homeo-atom:open_patient': () => this.manager.openPatient()
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
  try {
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, {});
    }
  }
  catch (e){
    atom.notifications.addFatalError("Root Folder '" + root + "' konnte nicht erstellt werden.", {})
  }

}
