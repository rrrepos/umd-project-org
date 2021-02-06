---
layout: default
title: UMD Project: Developers
---
[Back](../)
<br/>

## Developers
This section has information that are more technical in nature.

### Specs
#### What is the format of an UMD
{: .subtitle}
The contents of the umd file is specified in a markup file named `contents.uml`. This together with the content files themselves are compressed (zip) together as a file with **umd** extension. Check the example below.

#### Show the contents of a sample uml file
{: .subtitle}
The contents of the `sample-edu.umd` from the examples section is:
```html
<uml type="umd" ver="1">;
    <umd-component-image data-source="include"
        data-content="masthead.png">
    </umd-component-image>
    <umd-component-md data-source="include" 
        data-content="check.md">
    </umd-component-md>
    <umd-component-video data-source="embed"
        data-content="https://www.youtube.com/embed/vQCkYm3v3aA">
    </umd-component-video>
    <umd-component-md data-source="include"
        data-content="key-takeaway.md">
    </umd-component-md>
    <umd-component-form data-source="embed"
        data-content="https://docs.google.com/forms/d/e/
        1FAIpQLSeeRx7LQ_pc8XvKpNCvMT4zY_YI7lEAJ7-2uVRAHjLXy7EYnA/
        viewform?embedded=true"
        data-aspect="1:1.8">
    </umd-component-form>
</uml>
```
{: .contained}

The following is what the uml says:
* it has 5 components. An image followed by some text and a youtube video. Below it is a markdown text file and finally a google form link.
* each component has a source attribute. Source can be **include** or **embed**. Include *means* that the contents are included or part of the umd file. Embed *means* that the contents are on an external server and publicly accessible.
* in the above example, the image, text and markdown contents are included. While the youtube and google form are links.
* the youtube and google form links are publicly accessible and will be downloaded when the user opens this umd file.

#### How are the included files added to the umd
{: .subtitle}
In the above example, 3 of the components has files that are included in the umd. All this is done under the radar by the UMD App. The resultant UMD file (*uncompressed*) will have the following tree:

```
.
├── check.md
├── contents.uml
├── key-takeaway.md
└── masthead.png

```
{: .contained}

In summary, The UMD file is a compressed (*zip*) file of a folder that consists of:
1. a `contents.uml` that has component tags with appropriate attributes.
2. includes files that have been referenced as source *include*.

### Viewer
#### What are the different ways in which a UMD file can be viewed
{: .subtitle}
There are two ways:
1. **Using Viewer App**: Users can *open* an UMD file in the viewer. The app is available as a web-app (https://umd-project.org/app). Android users have an Android App (UMD App from the PlayStore).

2. **Embedding in a website or webapp**: Developers can embed a **umd-viewer-component** on any webpage. Details are given below.


#### How to embed the umd-viewer using url
{: .subtitle}
See the example below:

```html
<html>
    <head>
        ..
        <script src="umd-viewer.js"></script>
        ..
    </head>
    <body>
        ...
        <umd-viewer></umd-viewer>
        ...
    </body>    
    <script>
        loadUrl(url) {
            document.querySelector("#my-viewer).url = url;
        }
    </script>    

</html>    
```
{: .contained}

1. `umd-viewer.js` is the library to the **umd-viewer** webcomponent.
2. Set the `url` object in the  `umd-viewer` webcomponent to point to the source of the umd file.
3. Download [umd-viewer-wc.min.js](../components/umd-viewer-wc.min.js)


#### How to embed the umd-viewer using file object
{: .subtitle}
Developers can set a **file-object** via javascript to the webcomponent. A working example has been included in the repo.

```html
<html>
    <head>
        ..
        <script src="umd-viewer.js"></script>
        ..
    </head>
    <body>
        ...
        <input id="upload-file" type="file">
        ...
        <umd-viewer id="my-viewer"></umd-viewer>
        ...

        <script>
            const _ele = document.querySelector("#upload-file");
            _ele.onchange = function(e) {
                const _fileobj = _ele.files[0]; 
                if(_fileobj) {
                    document.querySelector("#my-viewer).file = _fileobj;
                }
            }
        </script>    
    </body>    
</html>    
```
{: .contained}

1. `umd-viewer.js` is the library to the **umd-viewer** webcomponent.
2. Set the `file` object in the  `umd-viewer` webcomponent to point to the file object.
3. Download [umd-viewer-wc.min.js](../components/umd-viewer-wc.min.js)

### Editor
#### Which tool is required to create or edit an UMD file
{: .subtitle}
The same UMD App. It is a viewer-cum-editor app.

#### Is there any tutorial available to get started
{: .subtitle}
Yes, we have added a link in the main App page that loads a help file (*naturally* created in umd format).

#### Is any registration required to create or edit an UMD file
{: .subtitle}
No. No login. Just create or edit and download the umd in your local drive.

#### What are the components supported in an UMD file
{: .subtitle}
1. **umd-component-text**: Text may be formatted using popular html formats. The editor has an inline tool to format the text. In this component you can type any text and it gets included in the umd.

2. **umd-component-image**: Images can be included by *uploading from your local drive* or can be embedded by providing a *link url*. 

3. **umd-component-video**: Videos again can be included or embedded. It is recommended to embed videos from popular streaming websites like youtube or vimeo to gain advantage of the streaming features. Videos, if included, will increase the size of the umd file.

4. **umd-component-audio**: Audios can be included (recommended) to serve as a podcast inside an UMD. 

5. **umd-component-pdf**: PDFs can be included by uploading them or embedded by providing a valid link. If a PDF is multi-page, all the pages are shown one below the other.

6. **umd-component-markdown**: Markdown files can be added as a easy and convenient content type. 

7. **umd-component-form**. Forms are components that will support user interaction. This can be questionnaires, assessments, feedback, or any other input content. Currently, UMD supports the **google forms** engine. We will be adding other popular form engines shortly. The form component will only accept the embedded type (*not the include type*) with the google form url as input when creating the component.

#### What is the order in which the components are listed when displaying the UMD file
{: .subtitle}
It is in the order that you add the components. Consequently, the editor tools lets you **reorder** the components as well as **remove** a component before downloading the UMD.

#### What is the layout of the components when displaying the UMD file
{: .subtitle}
It is top to down (*vertical*) one below the other. In subsequent versions of the UMD viewer we will be introducing the layout attribute to specify alternate layouts.

#### Are there restrictions in accessing UMD files on the internet
{: .subtitle}
Yes. The restrictions are **not related** to UMD files but the restrictions imposed by browsers in accessing internet stored files. The issue is called CORS which stands for **Cross Origin Resource Sharing**. Simply put if your browser app accesses files from another domain on the internet it can do so only if that domain permits access to it. Hence to share UMD (or any other files) with the browser the storage platform on which you store must be set to support CORS.

#### Will publicly shared files form Dropbox be linked to the viewer
{: .subtitle}
Yes. You may upload the generated UMD file in drop box and share it. The Shared link will be something like this: `https://www.dropbox.com/s/{file-id}?dl=0`. 
1. To view this file, you may enter it in the input field called URL on the home screen of the App.
2. Or, alternatively you can send a link to your colleague such as: 
```
https://umd-project.org/app?url=https://www.dropbox.com/s/{file-id}?dl=0
```
Of course, you need to replace the file-id with an appropriate one. 
3. Check out: [https://umd-project.org/app/?url=https://www.dropbox.com/s/nm6bempxm8386ju/sample-edu.md?dl=0](https://umd-project.org/app/?url=https://www.dropbox.com/s/nm6bempxm8386ju/sample-edu.md?dl=0){:target="_blank"}
