class Server {
	constructor() {
		this.socketIO = require('socket.io')
		this.puppeteer = require('puppeteer')
		
		this.socketLabel = 'browser'
		this.port = process.env.PORT
		this.viewPort = {
			width: 1920,
			height: 1080
		}
		
		this._start()
	}
	
	_start() {
		this._startBrowser().then(() => {
			return this._setSocketServer()
		}).then(() => {
			console.log('Socket server has been established on port ' + this.port)
		}).catch(error => {
			this._error(error)
		})
	}
	
	_startBrowser() {
		return new Promise(async success => {
			let args = ['--no-sandbox', '--disable-setuid-sandbox', '--explicitly-allowed-ports=81']
			this.browser = await this.puppeteer.launch({args})
			success()
		}).catch(error => {
			this._error(error)
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
						}).catch(error => {
							this._error(error)
						})
					}
				})
			})
			this.socketServer.on('error', error => {
				this._error(error)
			})
			success()
		}).catch(error => {
			this._error(error)
		})
	}
	
	_getHtml(object) {
		return new Promise(async success => {
			let answer = {
				html: '',
				error: false
			}
			try {
				let page = await this.browser.newPage()
				await page.setViewport(this.viewPort)
				
				let url = object.url
				let scheme = url.replace(/^(http.?\:\/\/)?.*$/, '$1')
				if (!scheme) {
					url = 'http://' + object.url
				}
				
				if (object.cookies) {
					let cookiesWithUrl = []
					object.cookies.forEach(cookieObject => {
						cookieObject.url = url
						cookiesWithUrl.push(cookieObject)
					})
					await page.setCookie(...cookiesWithUrl)
				}
				
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
			} catch (error) {
				answer.error = error.toString()
			}
			success(answer)
		}).catch(error => {
			this._error(error)
		})
	}
	
	_error(error) {
		console.log(error)
	}
}

new Server()