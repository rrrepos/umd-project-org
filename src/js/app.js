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
//
window.addEventListener("message", message => {
    console.log(message.data) // Wayne is coming!!!
    alert(message.data);
    window.ReactNativeWebView.postMessage('Client received data')
  });
