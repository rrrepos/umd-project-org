// 404.js
//
import "./css/base.css";
import "./site.css";
//
document.querySelector(".main-container").removeAttribute("hidden");

window.onload = (e) => {
    window.setTimeout(function(e) {
        window.location.href = "/";
    }, 3000);
}
