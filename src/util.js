module.exports = {
	async getMode() {
		let varList = []
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?currentMode=true')
			this.logResponse(response)
			if (response.data.currentMode.value === undefined) {
				this.log('warn', 'getMode response contains no data')
				return undefined
			}
			this.r9300.mode = response.data.currentMode.value
			varList['mode'] = this.r9300.mode
			this.checkFeedbacks('currentMode')
			this.setVariableValues(varList)
			return this.r9300.mode
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getChannel() {
		let varList = []
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?currentChannel=true')
			this.logResponse(response)
			if (response.data.currentChannel === undefined) {
				this.log('warn', 'getChannel response contains no data')
				return undefined
			}
			this.r9300.uri = response.data.currentChannel
			varList['currentChannel'] = this.r9300.uri
			this.checkFeedbacks('currentChannel')
			this.setVariableValues(varList)
			return this.r9300.uri
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getVolume() {
		let varList = []
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?volume=true')
			this.logResponse(response)
			if (response.data.volume === undefined) {
				this.log('warn', 'getVolume response contains no data')
				return undefined
			}
			this.r9300.volume = parseInt(response.data.volume)
			varList['volume'] = this.r9300.volume
			this.setVariableValues(varList)
			return this.r9300.volume
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getMute() {
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?mute=true')
			this.logResponse(response)
			if (response.data.mute === undefined) {
				this.log('warn', 'getMute response contains no data')
				return undefined
			}
			this.r9300.mute = !!response.data.mute
			this.checkFeedbacks('mute')
			return this.r9300.mute
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getTeletext() {
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?teletext=true')
			this.logResponse(response)
			if (response.data.teletext === undefined) {
				this.log('warn', 'getTeletext response contains no data')
				return undefined
			}
			this.r9300.teletext = response.data.teletext == 'on' ? true : false
			this.checkFeedbacks('teletext')
			return this.r9300.teletext
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
}
