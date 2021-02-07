// import css
import "../css/base.css";
import "../site.css";

// toggle of faqs
const toggle = (e) => {
    if (e.currentTarget.open) {
        document.querySelectorAll("details").forEach(ele => {
            if (ele !== e.currentTarget && ele.open) {
                ele.open = false;
            }
        });
    }
}

// unhide main after loading css
document.querySelector(".main-container").removeAttribute("hidden");
// set toggle events
document.querySelectorAll("details").forEach(ele => ele.addEventListener("toggle", toggle));