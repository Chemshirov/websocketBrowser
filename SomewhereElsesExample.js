class Browser {
	constructor({socketIOclient, Errors}) {
		this.socketIOclient = socketIOclient
		this.Errors = Errors
	}
	
	setHostName(hostName) {
		this.hostName = hostName
	}
	
	getHtml(url, selector, cookies) {
		return new Promise(async success => {
			let htmler = new Htmler({
				socketIOclient: this.socketIOclient,
				Errors: this.Errors,
				hostName: this.hostName,
				url,
				selector,
				cookies
			})
			await htmler.connect()
			let html = await htmler.get()
			success(html)
		}).catch(error => {
			this.Errors.log('Browser', 'html', error)
		})
	}
}

class Htmler {
	constructor(object) {
		Object.keys(object).forEach(key => {
			this[key] = object[key]
		})
		this.socketLabel = 'browser'
	}
	
	connect() {
		return new Promise(success => {
			this._setSocketToBrowser().then(socket => {
				this.socket = socket
				success()
			})
		}).catch(error => {
			this.Errors.log('Htmler', 'connect', error)
		})
	}
	
	_setSocketToBrowser() {
		return new Promise(success => {
			let origin = 'ws://' + this.hostName
			let config = {
				reconnect: true, 
				transports: ['websocket']
			}
			let socket = this.socketIOclient.connect(origin, config)
			socket.send = this._send(socket)
			socket.result = this._result.bind(this)
			socket.on(this.socketLabel, object => {
				if (object) {
					this._onResult(object)
				}
			})
			socket.on('connect', () => {
				success(socket)
			})
		}).catch(error => {
			this.Errors.log('Htmler', '_setSocketToBrowser', error)
		})
	}
	
	_send(socket) {
		return (object) => {
			socket.emit(this.socketLabel, object)
		}
	}
	
	_result(callback) {
		this._callback = callback
	}
	
	_onResult(object) {
		if (this._callback) {
			this._callback(object)
		}
	}
	
	get() {
		return new Promise(success => {
			if (this.socket && this.url) {
				this.socket.send({
					url: this.url,
					waitForSelector: this.selector,
					cookies: this.cookies
				})
				this.socket.result(object => {
					if (object.error) {
						this.Errors.log('Htmler', 'distant browser', object.error)
						success('')
					} else {
						if (object.html) {
							success(object.html)
						}
					}
				})
			} else {
				success('')
			}
		}).catch(error => {
			this.Errors.log('Htmler', 'get', error)
		})
	}
}

module.exports = Browser