// drive.js

// check if doclink has beens sent via url
const getQueryString = (field) => {
    const href = window.location.href;
    const reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
    const string = reg.exec(href);
    return string ? string[1] : null;
};

const getFilename = (id) => {
    return new Promise(resolve => {
        var request = gapi.client.drive.files.get({
            'fileId': id
        });
        request.execute(resp => {
            resolve(resp.name);
        });
    })
}

const downloadFile = (id) => {
    return new Promise(resolve => {
        const _url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
        var accessToken = gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _url);
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.onload = function (e) {
            resolve(xhr.response)
        };
        xhr.onerror = function (err) {
            console.log(err)
            resolve(null);
        };
        xhr.send();
    });
}

//const _url = getQueryString("url");
/*
if (_url) {
    const _ele = document.querySelector("[url-input]");
    _ele.focus()
    _ele.value = _url;
    _ele.blur();
}
*/
// get fileIds from url
var fileIds = [];
const _state = getQueryString("state");
if (_state) {
    const _j = JSON.parse(decodeURI(_state));
    fileIds = _j.ids;
}


// Client ID and API key from the Developer Console
//var CLIENT_ID = '510675615014-9lqtlnqb3tegh66l6mnrag5kodnf4eq6.apps.googleusercontent.com';
var CLIENT_ID = '510675615014-2v1g2df4o4h3m8mko83cptqi6v08kigo.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBEnaFDunvaufD-A1l77_lTXefr6S25WNk';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.install';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        document.querySelector(".error").innerHTML = JSON.stringify(error, null, 2);
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //listFiles();
        //return;
        let filename = "test.umd";
        if (fileIds.length > 0) {
            getFilename(fileIds[0])
                .then(_name => {
                    filename = _name;
                    return downloadFile(fileIds[0]);
                })
                .then(blob => {
                    if (blob) {
                        const _file = new File([blob], filename);
                        document.querySelector("[drive]").classList.add("visuallyhidden");
                        document.querySelector("#new-doc").classList.remove("visuallyhidden");
                        _addDoc(_file);
                    }
                });
        }
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    document.querySelector(".tab-bar").classList.add("invisible");
    document.querySelectorAll(".umd-container").forEach(ele => ele.classList.add("visuallyhidden"));
    document.querySelector("[drive]").classList.remove("visuallyhidden");
    gapi.auth2.getAuthInstance().signOut();
}


function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
    gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name, size)"
    }).then(function (response) {
        appendPre('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ':' + file.size + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

const _openUrl = (e) => {
    const _ele = document.querySelector("[url-input]");
    const _url = _ele.value;
    if (!_url) return;

    let _filename = "untitled";
    const _f = _url.split("/").pop();
    if (_f) {
        _filename = _f;
    }
    _ele.setAttribute("disabled", "disabled");
    _ele.value = "loading ...";
    fetch(_url)
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.blob();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(blob => {
            const _file = new File([blob], _filename, { type: blob.type });
            _addDoc(_file);
            _ele.value = "";
            _ele.removeAttribute("disabled");
        })
        .catch(_err => {
            console.log(99, _err);
            _ele.value = _url;
            _ele.classList.add("input-error");
            _ele.removeAttribute("disabled");
        })
}

const _urlKeyup = (e) => {
    e.currentTarget.classList.remove("input-error")
    if (e.key == "Enter") {
        e.currentTarget.blur();
    }
}

const _openClick = (e) => {
    document.querySelector("[file-input]").click();
    // clear any past
    document.querySelector("[url-input]").value = "";
}

const _addFile = (e) => {
    // get file
    const _file = document.querySelector("[file-input]").files[0];
    if (!_file) return;

    _addDoc(_file);
    document.querySelector("[url-input]").value = "";
}

const _addDoc = (file) => {
    // get tabbar
    const _tabbar = document.querySelector(".tab-bar");
    // remove active
    _tabbar.querySelectorAll(".tab").forEach((e => e.classList.remove("tab-active")));
    // get the default-tab element to insert new element
    const _tabnew = document.querySelector("[tab-default]");

    // create tab element
    const _tabele = document.createElement("div");
    // set the id
    const _tabid = file.name.replace(/([!?\,\.() ])/g, "-").toLowerCase();
    _tabele.id = _tabid;
    // add classes
    _tabele.classList.add("tab", "tab-active");
    // create name ele
    const _nameele = document.createElement("div");
    // update name
    _nameele.innerHTML = file.name;
    // add element
    _tabele.appendChild(_nameele);
    // create close ele
    const _closeele = document.createElement("div");
    // add class
    _closeele.classList.add("tab-close");
    // add cross
    _closeele.innerHTML = "&#10005;";
    // add close element
    _tabele.appendChild(_closeele);
    // close click event
    _closeele.addEventListener("click", _closeClick);

    // append tab element to tabbar
    _tabbar.insertBefore(_tabele, _tabnew);
    // tab click event
    _tabele.addEventListener("click", _tabClick);

    // remove tabbar invisibility if so
    _tabbar.classList.remove("invisible");

    // get tab container
    const _container = document.querySelector(".tab-container");
    // hide all docs
    _container.querySelectorAll(".umd-container").forEach((e => e.classList.add("visuallyhidden")));
    // create new doc
    const _umddoc = document.createElement("umd-viewer");
    // add it to container
    _container.appendChild(_umddoc);
    // set id
    _umddoc.id = `${_tabid}-doc`;

    // set file
    _umddoc.file = file;

    // set class
    _umddoc.classList.add("umd-container");

    // clear the input value
    document.querySelector("[file-input]").value = "";
}

const _tabClick = (e) => {
    // get tab element clicked
    const _tabele = e.currentTarget;
    // get tabbar element
    const _tabbar = document.querySelector(".tab-bar");
    // remove active tab
    _tabbar.querySelectorAll(".tab").forEach((e => { e.classList.remove("tab-active") }));
    // make tab element active
    _tabele.classList.add("tab-active");

    // 
    const _container = document.querySelector(".tab-container");
    // hide all umd-containers
    _container.querySelectorAll(".umd-container").forEach((e => e.classList.add("visuallyhidden")));
    // show appropriate umd-container 
    document.querySelector(`#${_tabele.id}-doc`).classList.remove("visuallyhidden");
}

const _closeClick = (e) => {
    // first stop propogation
    e.stopPropagation();

    // get tab element
    const _tabele = e.currentTarget.parentElement;
    // get tab id
    const _tabid = _tabele.id;
    // remove tab element
    _tabele.remove();

    // get main container element
    const _container = document.querySelector(".tab-container");

    // get corresponding doc (umd-container) and remove it
    const _docele = document.querySelector(`#${_tabid}-doc`);
    if (_docele) {
        _docele.remove();
    }

    // get tabBar
    const _tabbar = document.querySelector(".tab-bar");
    // get all tab
    const _tabeles = _tabbar.querySelectorAll(".tab");
    // get first tab ele
    const _tab1 = _tabeles[0];
    // remove active
    _tabeles.forEach((e => e.classList.remove("tab-active")));
    // make first element active
    _tab1.classList.add("tab-active");

    // hide all docs
    _container.querySelectorAll(".umd-container").forEach((e => e.classList.add("visuallyhidden")));
    // now show corresponding doc
    document.querySelector(`#${_tab1.id}-doc`).classList.remove("visuallyhidden");

    // finally check if tab1 is new 
    if (_tab1.id == "new") {
        _tabbar.classList.add("invisible")
    }
}

handleClientLoad();

