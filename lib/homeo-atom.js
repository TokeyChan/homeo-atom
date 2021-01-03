'use babel';

const fs = require('fs');
const root = '/home/benjamin/homeo-atom';

import PatientManager from './patient-manager';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  subscriptions: null,
  manager: null,

  initialize(state) {
    createRootIfNotExists();
  },

  activate(state) {
    this.manager = new PatientManager(state);

    this.subscriptions = new CompositeDisposable(
      /*
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://homeo-atom') {
          return new HomeoAtomView();
        }
      }),
      */

      atom.commands.add('atom-workspace', {
        'homeo-atom:toggle': () => this.toggle(),
        'homeo-atom:new_patient': () => this.newPatient()
      }),
      /*
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof HomeoAtomView) {
            item.destroy();
          }
        });
      })
      */
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    this.manager.loadPatients();
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
