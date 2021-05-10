# Docker image for Pupperteer and Socket.io
Get html string by emitting websocket request with url.

### Installation

**1. Install Docker and Docker-compose**

**2. Build an image from the Dockerfile**
```bash
docker build -t websocketBrowser:20210319_213600 ~/websocketBrowser/
```
Note: it takes some time, because Chromium has giant dependency bunch.

**3. Alter .yml**
If you've changed the string at the second task or prefer to use another port.

**4. Run .sh**
```bash
~/websocketBrowser/start_git.sh
```
Note: attached mode runs by adding a second parameter.
```bash
~/websocketBrowser/start_git.sh show
```

### Usage

**1. Include the example file to you server where Socket.IO client is running**

**2. Initiate browser class**
```js
let Browser = new (require('~/websocketBrowser/' + 'SomewhereElsesExample.js'))({
	socketIOclient: this.socketIOclient,
	Errors: this.Errors
})
```

**3. Set a host name or IP of the websocketBrowser container**
```js
this.Browser01 = Browser.setHostName(this.hostNameOrIp + ':82')
```
Once or not if you have several websocketBrowser containers.

**4. Get HTML string**
```js
this.Browser01.getHtml('example.com/test', '#anyCssSelector').then(html => {
	console.log(html)
})
```
Note: css selector is not required. Browser will wait for it if present.
The awaiting limit is 30 seconds.