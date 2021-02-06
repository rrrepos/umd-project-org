// umd-creator.js
//
// umd-creator as a web component

// import Umd Class
import {UmdComponentImage} from './umd-component-image.js';
//
// create a template
const template = document.createElement("template");
template.innerHTML = `
    <style>
    :host {
        width: 100%;
        height:100%;
        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: auto;
        grid-row-gap: 0.2rem;
        font-size: 1.4rem;
        align-items: center;
        justify-items: center;
    }

    :host([hidden]), [hidden] {
        display: none !important;
    }

    .block {
        min-height: 6.4rem;
        width: 100%;
        max-width: 60rem;
        display: grid;
        grid-template-rows: max-content max-content;
        grid-template-columns: 6.4rem 1fr minmax(6.4rem, max-content);
        align-items: center;
        justify-items: center;
        background-color: #252525;
    }

    .menu-bar {
        grid-row: 2;
        grid-column: 1/4;
        height: 4.8rem;
        display: grid;
        grid-template-rows: max-content;
        grid-auto-columns: max-content;
        grid-column-gap: 1px;
        grid-auto-flow: column;
    }

    .tab-image {
        background-image: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23efefef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>');
    }

    .tab-audio {
        background-image: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23efefef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-headphones"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>');
    }

    .tab-pdf {
        background-image: url("/images/pdf.svg");
    }

    .tab-video {
        background-image: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23efefef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>');
    }

    .message {
        grid-row: 1;
        grid-column: 2;
        font-size: 1.4rem;
        color: #a8a8a8;
        text-align: center;
    }

    .name {
        grid-row: 1;
        grid-column: 1;
        font-size: 1.2rem;
        color: #a8a8a8;
        padding-left: 1.6rem;
    }


    .form {
        grid-row: 2;
        grid-column: 1/-1;
        width: 100%;
    }

    .action-row {
        padding: 0.8rem;
        grid-row: 1;
        grid-column: 3;
        justify-self: end;
        display: grid;
        grid-template-rows: max-content;
        grid-auto-columns: max-content;
        grid-auto-flow: column;
    }

    .action {
        width: 3.6rem;
        height: 3.6rem;
        line-height: 3.6rem;
        text-align: center;
        cursor: pointer;
        color: #fafafa;
        font-size: 1.6rem;
    }

    .component {
        grid-row: 2;
        grid-column: 1/-1;
        width:100%;
        color: #666;
    }

    .input {
        font-size: 1.4rem;
        height: 3.2rem;
        line-height: 3.2rem;
        justify-self: center;
        text-align: center;
        background-color: #2d2d2d !important; 
        border: none;
        outline: none;
        color: #fafafa;
    }

    ::placeholder {
        font-size: 1.2rem;
        color: #8a8a8a;
        font-weight: 300;
        font-family: "Droid Sans Mono", "monospace", monospace, "Droid Sans Fallback";
    }

    input:focus {
        outline: none;
        border: none;
    }

    .input-error {
        border: solid 0.5px #CF6679;
    }

    </style>
    <div add-component class="block">
        <div class="action-row">
            <div class="action add-close">&#10005;</div>
        </div>    
        <div class="message">Select Component to Add</div>
        <div class="components-menu-bar">
            <div class="tab tab-image" title="image component"></div>
            <div class="tab tab-audio" title="audio component"></div>
            <div class="tab tab-pdf" title="pdf component"></div>
            <div class="tab tab-video" title="video component"></div>
        </div>
    </div>
    <div edit-component class="block" hidden>
        <div class="action-row">
            <div class="action save" title="save">&#10004;</div>
            <div class="action cancel" title="cancel">&#10007;</div>
        </div>    
        <div class="name"></div>
        <div class="form">
        </div>
    </div>
`

// create the custom element
export class UmdCreator extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "closed" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this._no = 0; // number of components;
        this._new = false; // set to true when adding a component

        // event listeners
        this._shadowRoot.querySelector(".tab-add").addEventListener("click", this._showAddComponent.bind(this));
        this._shadowRoot.querySelector(".add-close").addEventListener("click", this._closeAddComponent.bind(this));
        this._shadowRoot.querySelector(".tab-image").addEventListener("click", this._addImageComponent.bind(this));
        this._shadowRoot.querySelector(".save").addEventListener("click", this._saveChanges.bind(this));
        this._shadowRoot.querySelector(".cancel").addEventListener("click", this._cancelChanges.bind(this));
    }

    // on adding to the DOM
    connectedCallback() {
    }

    _showAddComponent(e) {
        this._shadowRoot.querySelector("[add-component]").removeAttribute("hidden");
    }

    _closeAddComponent(e) {
        this._shadowRoot.querySelector("[add-component]").setAttribute("hidden", "");
    }

    _addImageComponent(e) {
        this._addComponent("image");
        this._closeAddComponent();
    }

    _addComponent(component) {
        this._new = true;
        const _container = this._shadowRoot.querySelector(".container");
        const _editele = this._shadowRoot.querySelector("[edit-component]");
        _editele.querySelector('.name').innerHTML = component;

        _container.insertAdjacentElement("beforeend", _editele);
        _editele.removeAttribute('hidden');
    }

    _saveChanges(e) {

    }

    _cancelChanges(e) {

    }

    _addComponent2(component) {
        this._new = true;
        const _container = this._shadowRoot.querySelector(".container");

        const _block = document.createElement("div");
        _block.classList.add("block");

        const _actionrow = document.createElement("div");
        _actionrow.classList.add("action-row");

        const _save = document.createElement("div");
        _save.classList.add("action");
        _save.innerHTML = "&#10005;";
        _save.title = "save";
        _save.addEventListener("click", e => {
        });
        _save.setAttribute("hidden", "");
        _actionrow.appendChild(_save);

        const _cancel = document.createElement("div");
        _cancel.classList.add("action");
        _cancel.innerHTML = "&#10005;";
        _cancel.title = "cancel";
        _cancel.addEventListener("click", e => {
        });
        _cancel.setAttribute("hidden", "");
        _actionrow.appendChild(_cancel);

        const _edit = document.createElement("div");
        _edit.classList.add("action");
        _edit.innerHTML = "&#9998;";
        _edit.title = "edit";
        _edit.addEventListener("click", e => {
            
        });
        _actionrow.appendChild(_edit);

        const _down = document.createElement("div");
        _down.classList.add("action");
        _down.innerHTML = "&#8681;";
        _down.title ="move down";
        _down.addEventListener("click", e => {
            
        });
        _actionrow.appendChild(_down);

        const _up = document.createElement("div");
        _up.classList.add("action");
        _up.innerHTML = "&#8679;";
        _up.title ="move up";
        _up.addEventListener("click", e => {
            
        });
        _actionrow.appendChild(_up);

        const _delete = document.createElement("div");
        _delete.classList.add("action");
        _delete.innerHTML = "&#9986;";
        _delete.title = "delete";
        _delete.addEventListener("click", e => {
            
        });
        _actionrow.appendChild(_delete);

        _block.appendChild(_actionrow);

        const _name = document.createElement("div");
        _name.classList.add("name");
        _name.innerHTML = `${this._no+1}: ${component}`;
        _block.appendChild(_name);

        const _component = document.createElement("umd-component-image");
        _component.classList.add('component');
        _block.appendChild(_component);

        _container.appendChild(_block);
        _block.setAttribute("data-component", component);

    }

    // attribute change
    attributeChangedCallback(name, oldVal, newVal) {
    }

    // on being removed from DOM
    disconnectedCallback() {
    }
}
// register component 
window.customElements.define("umd-creator", UmdCreator);