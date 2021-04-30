class Server {
	constructor() {
		this.socketLabel = 'browser'
		this.socketIO = require('socket.io')
		this.puppeteer = require('puppeteer')
		this.port = process.env.PORT
		this._start()
	}
	
	_start() {
		this._startBrowser().then(() => {
			return this._setSocketServer()
		}).then(() => {
			console.log('Socket server has established on port ' + this.port)
		}).catch(err => {
			this._error(err)
		})
	}
	
	_startBrowser() {
		return new Promise(async success => {
			let args = ['--no-sandbox', '--disable-setuid-sandbox', '--explicitly-allowed-ports=81']
			this.browser = await this.puppeteer.launch({args})
			success()
		}).catch(err => {
			this._error(err)
		})
	}
	
	_setSocketServer() {
		return new Promise(success => {
			this.socketServer = this.socketIO(this.port)
			this.socketServer.on('connection', socket => {
				socket.on(this.socketLabel, object => {
					if (object && object.url) {
						this._getHtml(object).then(object => {
							socket.emit(this.socketLabel, object)
						}).catch(err => {
							this._error(err)
						})
					}
				})
			})
			this.socketServer.on('error', error => {
				this._error(error)
			})
			success()
		}).catch(err => {
			this._error(err)
		})
	}
	
	_getHtml(object) {
		return new Promise(async success => {
			let answer = {
				html: '',
				error: false
			}
			try {
				let scheme = object.url.replace(/^(http.?\:\/\/)?.*$/, '$1')
				if (!scheme) {
					scheme = 'http://'
				}
				let url = scheme + object.url
				
				let page = await this.browser.newPage()
				await page.setViewport({
					width: 1920,
					height: 1080
				})
				if (object.cookies) {
					let cookiesWithUrl = []
					object.cookies.forEach(cookieObject => {
						cookieObject.url = url
						cookiesWithUrl.push(cookieObject)
					})
					await page.setCookie(...cookiesWithUrl)
				}
				console.log('url', url)
				await page.goto(url, {
					waitUntil: 'networkidle0'
				})
				if (object.waitForSelector) {
					await page.waitForSelector(object.waitForSelector)
				}
				answer.html = await page.content()
				if (object.cookies) {
					await page.deleteCookie(...object.cookies)
				}
				await page.close()
			} catch (err) {
				answer.error = err.toString()
			}
			success(answer)
		}).catch(err => {
			this._error(err)
		})
	}
	
	_error(err) {
		console.log(err)
	}
}

new Server()