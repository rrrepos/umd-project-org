// umd-viewer.js
//
// umd-viewer as a web component

// import Umd Class
import Umd from "../umd-core/Umd.js";

// import components
import {UmdComponentMd} from "../umd-components-wc/md/umd-component-md.js";
import {UmdComponentPdf} from "../umd-components-wc/pdf/umd-component-pdf.js";
import {UmdComponentImage} from "../umd-components-wc/image/umd-component-image.js";
import {UmdComponentAudio} from "../umd-components-wc/audio/umd-component-audio.js";
import {UmdComponentVideo} from "../umd-components-wc/video/umd-component-video.js";
import {UmdComponentText} from "../umd-components-wc/text/umd-component-text.js";
import {UmdComponentForm} from "../umd-components-wc/form/umd-component-form.js";

//
// create a template
const template = document.createElement("template");
template.innerHTML = `
    <style>
    :host {
        width: 100%;
        height:100%;
        max-width: 600px;
        display: grid;
        grid-template-rows: auto !important;
        grid-template-columns: auto !important;
        font-family: sans-serif;
    }

    :host([hidden]), [hidden] {
        display: none !important;
    }
    
    .password-container {
        grid-row: 1;
        display: grid;
        grid-template-rows: repeat(2, max-content);
        grid-template-columns: max-content;
        grid-row-gap: 16px;
        align-content: center;
        justify-content: center;
    }

    .message {
        font-size: 14px;
        text-align: center;
    }

    .input {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        justify-self: center;
        text-align: center;
        outline: none;
    }

    ::placeholder {
        font-size: 12px;
    }

    input:focus {
        outline: none;
        border: none;
    }

    .input-error {
        border: solid 0.5px #ff0000;
    }

    .content {
        grid-row: 1;
        display: grid;
        grid-auto-rows: max-content;
        grid-template-columns: auto;
        grid-row-gap: 16px;
    }

    </style>
    <div class="password-container" hidden>
        <div class="message">Enter this document"s password</div>
        <input class="input" size="20" type="password" placeholder="passwords are case sensitive">
    </div>
    <div class="content" hidden>
    </div>
`

// create the custom element
export class UmdViewer extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "closed" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this._file = null;
        this._url = "";
        this._password = "";
        this._loaded = false;
        this._beingLoaded = false;
        this._umd = new Umd();
        this._shadowRoot.querySelector(".input").addEventListener("blur", this._checkPassword.bind(this));
        this._shadowRoot.querySelector(".input").addEventListener("keyup", this._checkKeyup.bind(this));
    }

    // on adding to the DOM
    connectedCallback() {
    }

    // attribute change
    attributeChangedCallback(name, oldVal, newVal) {
        switch(name) {
            case "data-src":
                if(newVal) {
                    this._openUrl(newVal);
                }
                break;
        }
    }

    get file() {
        return this._file;
    }

    set file(obj) {
        this._file = obj;
        // reset _loaded
        this._loaded = false; 
        this._loadFile();
    }

    get url() {
        return this._url;
    }

    set url(url) {
        this._url = url;
        this._openUrl();
    }


    get password() {
        return this._password;
    }

    set password(p) {
        this._password = p;
        if(this._file) {
            this._loadFile();
        }
    }

    _openUrl() {
        if (!this._url) return;
    
        let _filename = "untitled";
        this._loaded = false;
        this._beingLoaded = false;
        const _f = this._url.split("/").pop();
        if (_f) {
            _filename = _f;
        }
    
        fetch(this._url)
            .then(response => {
                if (response.status >= 200 && response.status <= 299) {
                    return response.blob();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(blob => {
                const _file = new File([blob], _filename, { type: blob.type });
                this._file = _file;
                this._loadFile();
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    _loadFile() {
        // confirm readiness to load
        if(!this._file) return;
        if(this._loaded) return;
        if(this._beingLoaded) return;

        // required in multiple view cases
        this._beingLoaded = true;

        // set content and password elements
        const _contentele = this._shadowRoot.querySelector(".content");
        const _passwordele = this._shadowRoot.querySelector(".password-container");
        _contentele.innerHTML = "";
        _contentele.setAttribute("hidden", "");
        _passwordele.setAttribute("hidden", "");

        // open the file
        this._umd.openFile(this._file, this._password)
        .then(_res => {

            // render the components
            this._beingLoaded = false;
            this._loaded = true;
            this._umd.elements.forEach(ele => {
                _contentele.appendChild(ele);
            });
            // unhide the content element
            _contentele.removeAttribute("hidden");
        })
        .catch(_err => {
            this._beingLoaded = false;

            // unhide the password element for user input
            this._shadowRoot.querySelector(".password-container").removeAttribute("hidden");
            this._shadowRoot.querySelector(".input").focus();
            if(this._shadowRoot.querySelector(".input").value != "") { // something has been input
                this._shadowRoot.querySelector(".input").classList.add("input-error"); // add red border
            }
        });
    }

    _checkPassword(e) {
        this._shadowRoot.querySelector(".input").classList.remove("input-error");
        const _p = this._shadowRoot.querySelector(".input").value;
        if(!_p) return;
        if(this._password == _p) return;

        this._password = _p;
        this._loadFile();
    }

    _checkKeyup(e) {
        if(e.key == "Enter") {
            this._checkPassword(e);
        }
    }

    // on being removed from DOM
    disconnectedCallback() {
    }
}
// register component 
window.customElements.define("umd-viewer", UmdViewer);