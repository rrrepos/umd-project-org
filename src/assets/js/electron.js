// import filer from modules
import * as filer from "./modules/filer.js";
// set ipcRenderer from electron
const { ipcRenderer } = window.require('electron');

ipcRenderer.on("fileinfo", (event, contents) => {
    const _filename = contents.filepath.split("/").pop();
    const _file = new File([contents.buffer], _filename);
    console.log(_file);
    filer.loadFile(_file, "");
  });


// show main container after loading  
document.querySelector(".main-container").removeAttribute("hidden");
// set filer events
filer.setEvents();