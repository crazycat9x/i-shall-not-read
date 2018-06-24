# i-shall-not-read
A Chrome/Firefox extension that show you Facebook post estimated reading time before having to open them.

<img height="250" src="./docs/example.png">

### The main focus of this project is to detect Facebook application dynamic changes:
* Detection of new posts being added to the news feed
* Add an observer with callback to each loading post to determine when post finish loading and apply the callback to it
* Implement background process that listens to URL changes and emits events to content script
* Initialization and termination of event listeners and observers when switching between pages

The project is proven to be especially challenging as Facebook use no AJAX call to navigate its UI and provide no API for detecting change event.

Currently this plugin only work for Facebook main news feed page.
