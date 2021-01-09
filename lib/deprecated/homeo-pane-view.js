'use babel';

import { TextEditor, File } from 'atom';

export default class HomeoPaneView {

  constructor(filename) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add("homeo_pane_view");

    this.file = new File(filename);
    this.editor = new TextEditor({
      'showLineNumbers': false,
    });
    this.editor.element.classList.add('homeo_pane_editor');

    this.file.read(false).then(
      result => this.editor.setText(result),
      function(error) {
        console.log("error: " + error);
      }
    );

    this.element.appendChild(this.editor.element);
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return "TITEL";
  }

  getURI() {
    return 'homeo-atom://' + this.editor.getFileName();
  }
}
