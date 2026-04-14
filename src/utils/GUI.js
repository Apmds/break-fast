import LilGUI from 'lil-gui';
import Stats from 'three/addons/libs/stats.module.js';

class GUI {
    constructor() {
        // FPS monitor
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.gui = new LilGUI();
        this.gui_folders = {};
    }

    makeFolder(name) {
        this.gui_folders[name] = this.gui.addFolder(name);
    }

    add(folderName, name, object, param_name, $1, max, step) {
        return this.gui_folders[folderName].add(object, param_name, $1, max, step).name(name);
    }

    begin() {
        this.stats.begin();
    }

    end() {
        this.stats.end();
    }
}


export default GUI;