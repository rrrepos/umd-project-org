import Minizip from "./minizip-asm.min.js";

export default class Umd {
    constructor() {
        this._zip = new Minizip();
        this._umlname = "contents.uml"; // being stored for future
        this._components = [];
        this._umlcontents = ""; // this is a string
        this._filename = "untitled.umd"; // filename of the zipfile
        this._password = "";
        this._isEdited = false;
        this._id = "";
        this._readonly = false;
    }

    // getters and setters

    get filename() {
        return this._filename;
    }

    set filename(n) {
        // check if extension exists
        const _arr = n.split(".");
        this._filename = `${_arr[0]}.umd`;
    }

    set password(p) {
        this._password = p;
    }

    get readonly() {
        return this._readonly;
    }

    set readonly(bool) {
        this._readonly = bool;
    }

    get isEdited() {
        return this._isEdited;
    }

    set isEdited(bool) {
        this._isEdited = bool;
        this.listener(this);
    }

    listener(val) {
    }

    registerListener(fn) {
        this.listener = fn;
    }

    get elements() {
        return this._generateElements();
    }

    // open using fileobj
    async openFile(fileobj, password) { // password can be optional
        // check if fileobj is null
        if (!fileobj) return Promise.reject("invalid-file");

        // pick name of umd from fileobj
        if (fileobj.name) {
            this._filename = fileobj.name;
        }
        else {
            this._filename = "untitled.umd";
        }
        // update password if sent via param
        if (password) {
            this._password = password;
        }
console.log(1);
        return new Promise(async (resolve, reject) => {
            try {
                console.log(1.1)
                // read the buffer
                const _filebuffer = await this._readBuffer(fileobj);
                console.log(1.2);
                // convert to uint8array
                const _arr = new Uint8Array(_filebuffer);
                console.log(1.3, _arr);
                // create new object using arr
                this._zip = new Minizip(_arr);
                console.log(1.4, this._zip);
                // read list of zip content
                const _list = this._zip.list();
console.log(1.5);
                // check if password is required and get last uml file index
                let _hasPassword = false;
                let _umlele;
console.log(10);
                // get uml file
                for (const _ele of _list) {
                    // check if encrypted                    
                    if (_ele.crypt == true) {
                        _hasPassword = true;
                    }
                    // get extension
                    const _ext = _ele.filepath.split(".").pop().toLowerCase();
                    // store the uml file
                    if (_ext == "uml") {
                        _umlele = _ele;
                    }
                }

                // first check uml file exists
                if (!_umlele) reject("invalid-umd");

                // if encrypted confirm that password has been provided
                if (_hasPassword && !this._password) reject("password-required");

                // read the uml contents
                const _umlbuffer = this._zip.extract(_umlele.filepath, { "password": this._password });
                const _umlblob = new Blob([_umlbuffer]);
                // store the string
                this._umlcontents = await this._readBlobAsText(_umlblob);
                // convert to elements
                const _dom = this._stringToHTML(this._umlcontents);
                // get uml element
                // get readonly status
                const _ro = _dom.querySelector("uml").getAttribute("data-readonly");
                if (_ro) {
                    this._readonly = JSON.parse(_ro);
                }
                else {
                    // currently set readonly to true by default
                    this._readonly = true;
                }
                const _eles = _dom.querySelector("uml").querySelectorAll("*");
                this._components = [];
                console.log(20);
                _eles.forEach(_ele => {
                    // create a json
                    let _jsn = {};
                    _jsn.no = this._components.length + 1;
                    _jsn.name = _ele.tagName.toLowerCase();
                    _jsn.data = { "source": _ele.getAttribute("data-source"), "content": _ele.getAttribute("data-content") };
console.log(21);
                    if (_ele.getAttribute("data-aspect")) {
                        _jsn.data["aspect"] = _ele.getAttribute("data-aspect");
                    }
                    console.log(22);
                    if (_jsn.data.source == "include") {
console.log(23);
                        // extract content from path
                        let _arraybuffer;
                        if (_hasPassword) {
                            _arraybuffer = this._zip.extract(_ele.getAttribute("data-content"), { "password": this._password });
                        }
                        else {
                            _arraybuffer = this._zip.extract(_ele.getAttribute("data-content"));
                        }
                        console.log(24);
                        _jsn.data.arraybuffer = _arraybuffer;
                        this._components.push(_jsn);
                    }
                    else {
                        console.log(25);
                        this._components.push(_jsn);
                    }
                    console.log(26);
                });
                console.log(27);
                // set flags
                this._isEdited = false;
                // end
                resolve("");
            }
            catch (err) {
                console.log(err);
                reject("password-required");
            }
        });
    }

    appendComponent(component) {
        return new Promise(async (resolve) => {
            // create a json
            let _jsn = {};
            _jsn.no = this._components.length + 1;
            _jsn.name = component.name;
            _jsn.data = {};
            _jsn.data.source = component.source;
            _jsn.data.content = component.content;
            if (component.aspect) {
                _jsn.data.aspect = component.aspect;
            }
            // check for include
            if (_jsn.data.source == "include" && component.file) {
                // read the contents of the file
                const _filebuffer = await this._readBuffer(component.file);

                // convert to uint8array
                const _arr = new Uint8Array(_filebuffer);

                // convert to blob and store
                _jsn.data.arraybuffer = _arr;

                // update component array
                this._components.push(_jsn);
            }
            else {
                this._components.push(_jsn);
            }
            this.isEdited = true;
            console.log("add", this._components);
            resolve(_jsn.no);
        });
    }

    editComponent(component) {
        return new Promise(async (resolve) => {
            // read the json
            const _jsn = this._components[component.no - 1];
            _jsn.data.source = component.source;
            _jsn.data.content = component.content;
            if (_jsn.data.source == "include" && component.file) {
                // read the contents of the file
                const _filebuffer = await this._readBuffer(component.file);

                // convert to uint8array
                const _arr = new Uint8Array(_filebuffer);
                _jsn.data.arraybuffer = _arr;
            }
            this.isEdited = true;
            console.log("edit", this._components);

            resolve();
        });
    }

    moveComponent(no, direction) {
        const n = no;
        let s = n;
        if (direction == 'U') {
            if (n == 1) return;

            s = n - 1;
            const nindex = this._components.findIndex(component => component.no == n);
            const sindex = this._components.findIndex(component => component.no == s);

            this._components[nindex].no = s;
            this._components[sindex].no = n;
        }
        else if (direction == 'D') {
            if (n == this._components.length) return;

            s = n + 1;
            const nindex = this._components.findIndex(component => component.no == n);
            const sindex = this._components.findIndex(component => component.no == s);

            this._components[nindex].no = s;
            this._components[sindex].no = n;
        }
        this.isEdited = true;
        this._components.sort(function (a, b) {
            return a.no - b.no
        });
    }

    deleteComponent(no) {
        // find the index
        const nindex = this._components.findIndex(component => component.no == no);
        if (nindex != -1) {
            // temporarily set the no to 0
            this._components.no = 0;
        }

        // now renum 
        this._components.forEach(_component => {
            if (_component.no > no) {
                _component.no--;
            }
        });
        delete this._components[nindex];
        // remove blank
        this.isEdited = true;
        this._components = this._components.filter(function (el) { return el != null; });
        console.log("delete", this._components);
    }

    save() {
        return new Promise(resolve => {
            // instantiate new object 
            this._zip = new Minizip();

            // first generate uml
            this._generateUml();

            // add it to new zip
            if (this._password) {
                this._zip.append("contents.uml", this._umlcontents, { password: this._password });
            }
            else {
                this._zip.append("contents.uml", this._umlcontents);
            }

            // sort components
            // sort the array on
            this._components.sort(function (a, b) {
                return a.no - b.no
            });
            this._components.forEach(_component => {
                // check for include
                if (_component.data.source == "include") {

                    // store it in contents folder
                    if (this._password) {
                        this._zip.append(_component.data.content, _component.data.arraybuffer, { "password": this._password });
                    }
                    else {
                        console.log("appended: ", _component.data.content);
                        this._zip.append(_component.data.content, _component.data.arraybuffer);
                    }
                }
            });
            // now create file object
            var file = new File([this._zip.zip()], this._filename, { type: "application/octet-binary" });
            this.isEdited = false;
            console.log("final:", file);
            resolve(file);
        });
    }

    // internal methods
    _readBuffer(file) {
        return new Promise(resolve => {
            var fr = new FileReader();

            fr.onload = function (event) {
                resolve(event.target.result)
            };
            fr.readAsArrayBuffer(file);
        });
    }

    _readBlobAsText(blob) {
        return new Promise(resolve => {
            var fr = new FileReader();

            fr.onload = function (event) {
                resolve(event.target.result)
            };
            fr.readAsText(blob);
        });
    }

    _generateUml() {
        // sort the components
        this._components.sort(function (a, b) {
            return a.no - b.no
        });

        let _str = `<uml data-type="umd" data-readonly="${this._readonly}">`;
        for (let i = 0; i < this._components.length; i++) {
            const _component = this._components[i];
            const _name = _component.name;
            const _data = _component.data;
            _str += `<${_name}`;
            if (_data.source) {
                _str += ` data-source="${_data.source}"`;
            }
            if (_data.source == "include") {
                _str += ` data-content="${_data.content}"`;
            }
            else {
                _str += ` data-content="${_data.content}"`;
            }
            if (_data.aspect) {
                _str += ` data-aspect="${_data.aspect}"`;
            }
            _str += `></${_name}>`;
        }
        _str += "</uml>";
        this._umlcontents = _str;
    }

    _generateElements() {
        let _eles = [];
        this._components.sort(function (a, b) {
            return a.no - b.no
        });
        this._components.forEach(_component => {
            const _ele = document.createElement(_component.name);
            _ele.setAttribute("data-no", _component.no);
            _ele.setAttribute("data-source", _component.data.source);
            if (_component.data.aspect) {
                _ele.setAttribute("data-aspect", _component.data.aspect);
            }
            if (_component.data.content) {
                _ele.setAttribute("data-content", _component.data.content);
            }
            switch (_component.data.source) {
                case "embed":
                    _ele.setAttribute("data-url", _component.data.content);
                    break;
                case "include":
                    if (_component.data.arraybuffer) {
                        const _blob = new Blob([_component.data.arraybuffer]);
                        const _eleurl = URL.createObjectURL(_blob);
                        _ele.setAttribute("data-url", _eleurl);
                    }
                    else {
                        _ele.setAttribute("data-url", _component.data.url)
                    }
                    break;
            }
            _eles.push(_ele);
        });
        return _eles;
    }

    // helper methods
    _support() {
        if (!window.DOMParser) return false;
        var parser = new DOMParser();
        try {
            parser.parseFromString("x", "text/html");
        } catch (err) {
            return false;
        }
        return true;
    };

    _stringToHTML(str) {
        // If DOMParser is supported, use it
        if (this._support) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, "text/html");
            return doc.body;
        }

        // Otherwise, fallback to old-school method
        var dom = document.createElement("div");
        dom.innerHTML = str;
        return dom;
    };
}