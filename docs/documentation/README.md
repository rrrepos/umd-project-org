---
layout: default
title: UMD Project: Documentation
permalink: /index.html
---
[Back](../)
<br/>

## Documentation
This section will provide more details of the UMD project.

### About UMD
#### What is UMD
{: .subtitle}
UMD is a new type of document. It stands for **Universal Markup Document**. The spec uses vanilla markup language to specify its content. It supports multiple content types within one document; hence it is a Universal document.

#### What is the need for a new type of document
{: .subtitle}
In today's visual world most users would like to use a combination of content when communicating with others. Just a video is not enough. Similar though the PDF is a convenient and popular format it has its own limitations. Many users who have the need to use  combination of media types (image, text, audio, video, pdf) need some sort of a website to put that content up. A blogging website is a classic example. UMD now gives you the power to create such a document on your own to share it with who you wish without a website.

#### Is this a replacement for a PDF or Video
{: .subtitle}
No. Infact, it supports use of both these (as well as other) file types. Suppose you wish to share a Youtube video and below it add some text content that you would like to send to someone, say your student. Then, creating an UMD file with both these contents and emailing the umd file to the person is how you would use UMD. Further, if you wish that they share comments, you could add a Google form below it. Isn't it awesome?

#### What are the supported content types
{: .subtitle}
This is an ever growing list. At this point, the following are supported:

* **Text**: Both plain text as well as formatted text is supported. The app lets you type text and format it too!
* **Image**: All popular image formats will be displayed.
* **Audio**: mp3 and oog files have been tested. Other file types depend on the browser.
* **Video**: Besides uploading your own mp4 videos, UMD supports videos from streaming services like Youtube and Vimeo.
* **Markdown**: This popular and simple formatting works very well in UMD files.
* **Form**: This is a unique and potent feature of UMD. You may now embed google form as part of your UMD file. Users who open the fill can now fill the form to be stored in Google Sheets. We plan in the coming months to support other form engines.

#### How do we protect an UMD file
{: .subtitle}
The app permits you to specify a password when creating a file.Once done, the user will need to provide that password to open it. This is similar to the password protection available in PDFs.

#### How do we create an UMD file
{: .subtitle}
By using the free app. Read the section below on more details about it.

<br/>

### About the App
#### How do we access the app
{: .subtitle}
From a browser use the link: [https://umd-project.org/app](https://umd-project.org/app){:target="_blank"}. The app lets you view a UMD file as well as create or edit an existing one. *Kindly book-mark this url*.

An Android app is also conveniently built. It can be downloaded from the [PlayStore](https://play.google.com/store/apps/details?id=org.umdproject.umdapp)

An iOS app is under development.

#### How do we view files from the app
{: .subtitle}
There are a number of ways to achieve this.
1. By opening the file from your device or desktop using upload.
2. By typing the URL of the file if it is stored on an internet server. *There are restrictions. Please read the Developer section for more info*.
3. By adding the URL to the web app link using the url parameter.

Check out the [Examples section](../examples/readme.md).

#### Is the app free
{: .subtitle}
The app is **free**. In addition, there is no login required to view or create umd files.

<br/>

### Creating UMD files
#### How do we create a UMD file
{: .subtitle}
The app lets you view an UMD file as well as create it. The link is provided on the top of this screen. You can create a new UMD by adding components. The supported components are: text, image, audio, video, pdf, markdown. For each component you can provide the link or upload the file. That's it.

#### How many components can one UMD file hold
{: .subtitle}
There is no limit to the number of components. Multiple contents of the same component type too can exist. For example, <i>you can create a umd file that has an image banner followed by some heading text which follows with another image and then below it is an audio. Finally, this can end with a youtube video link followed by some PDF file!</i>

#### Once we add the components, how do we download the UMD
{: .subtitle}
In the app, after adding the desired content, you will notice a **Download** icon. Tapping on this will enable you to specify the filename, and any password protection that you may require. Once done, it will download the file in the default (*downloads*) directory of your browser.

#### Do we need to login to create a UMD file
{: .subtitle}
No. No login or fee required to view or create umd files.

#### Are the UMD files we create stored on any server
{: .subtitle}
No. The UMD files that you created can only be downloaded by the creator on their local storage. We only maintain statistics of number of files created as an indicator of the usage of this tool.

#### What about during Viewing of a UMD. Does it load it on any server 
{: .subtitle}
Again no. When you upload a UMD on the App to view it, it is loaded on your local device only.

#### Is there any training course?
Yes. [Course 101: Building your first UMD File](../app?url=/examples/files/umd-course-101.umd)