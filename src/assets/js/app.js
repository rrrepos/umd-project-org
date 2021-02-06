// modules
import * as filer from "./modules/filer.js";

// service worker function

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

// show main container
document.querySelector(".main-container").removeAttribute("hidden");

// set filer events
filer.setEvents();

//  call service worker
//setSw();