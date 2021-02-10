// modules
import * as filer from "./modules/filer.js";

const setSw = () => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register("../sw.js")
            .then(function (registration) {
                navigator.serviceWorker.addEventListener("message", event => {
                    //window.location.reload();
                });
            }).catch(function (error) {
                console.log("ServiceWorker registration failed:", error);
            });
    }
}

document.querySelector(".main-container").removeAttribute("hidden");
//
filer.setEvents();
// 
setSw();

document.addEventListener("test", (event) => {
    alert("1" + event.detail);
}, false);

window.addEventListener("message", (event) => {
    alert("2" + message.data);
}, false);


const loader = (blob) => {
    alert("yet again:");
    filer.loadBlob(blob);
    alert("not yet again");
}

window.loader = loader;