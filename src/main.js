const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresetsDefinitions = require('./presets')
const config = require('./config.js')
const util = require('./util')
const axios = require('axios')
const http = require('http')
const https = require('https')

const r9300port = 80
const r9300apiPath = '/cgi-bin/json_xfer'
const r9300timeOut = 5000
const r9300headers = { 'Content-Type': 'application/json' }
const pollInterval = 2000

class AvediaPlayer9300 extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...util })
		this.pollTimer = {}
	}

	logResponse(response) {
		if (this.config.verbose) {
			console.log(response)
		}
		if (response.data !== undefined) {
			this.updateStatus(InstanceStatus.Ok)
			this.log('info', `Data Recieved: ${JSON.stringify(response.data)}`)
		} else {
			this.updateStatus(InstanceStatus.UnknownWarning, 'No Data')
			this.log('warn', `Response contains no data`)
		}
	}

	logError(error) {
		if (this.config.verbose) {
			console.log(error)
		}
		if (error.code !== undefined) {
			this.log('error', `Error: ${JSON.stringify(error.code)}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, JSON.stringify(error.code))
		} else {
			this.log('error', `No error code`)
			this.updateStatus(InstanceStatus.UnknownError)
		}
	}

	pollStatus() {
		this.getMode()
		this.getChannel()
		this.getVolume()
		this.getMute()
		this.getTeletext()
		this.getChannelList()
		this.pollTimer = setTimeout(() => {
			this.pollStatus()
		}, pollInterval)
	}

	initR9300() {
		if (this.r9300) {
			delete this.r9300
		}
		this.r9300 = {
			mode: 'unknown',
			uri: 'unknown',
			volume: 'unknown',
			mute: 'unknown',
			teletext: 'unknown',
			channelList: [],
			channelName: 'unknown',
			channelNumber: 'unknown',
		}
	}

	setupAxios() {
		if (this.pollTimer) {
			clearTimeout(this.pollTimer)
		}
		if (this.axios) {
			delete this.axios
		}
		if (this.config.host && this.config.user && this.config.pass) {
			this.axios = axios.create({
				baseURL: `http://${this.config.host}:${r9300port}${r9300apiPath}`,
				timeout: r9300timeOut,
				headers: r9300headers,
				auth: {
					username: this.config.user,
					password: this.config.pass,
				},
				insecureHTTPParser: true,
				httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
				httpAgent: new http.Agent({ keepAlive: true }),
			})
			this.pollStatus()
		} else {
			this.log('warn', `Host undefined`)
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.config = config
		this.initR9300()
		this.setupAxios()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateChannelList()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		if (this.pollTimer) {
			clearTimeout(this.pollTimer)
			delete this.pollTimer
		}
		if (this.axios) {
			delete this.axios
		}
		delete this.r9300
	}

	async configUpdated(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.config = config
		this.initR9300()
		this.setupAxios()
		this.updateChannelList()
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresetsDefinitions() {
		UpdatePresetsDefinitions(this)
	}
}

runEntrypoint(AvediaPlayer9300, UpgradeScripts)
