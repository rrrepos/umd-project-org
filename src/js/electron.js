// modules
import * as filer from "./modules/filer.js";
const { ipcRenderer } = window.require('electron');

document.querySelector(".main-container").removeAttribute("hidden");
//
filer.setEvents();

// listen to data from electron
ipcRenderer.on("fileinfo", (event, fileinfo) => {
    const _filename = fileinfo.filepath.split(/(\\|\/)/).pop();
    const _buffer = fileinfo.buffer;
    const _file = new File([_buffer], _filename);
    if(!_file) return;

    document.querySelector("[open-button]").innerHTML = "loading ...";
    filer.loadFile(_file, "");
});