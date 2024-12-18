import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import UpdatePresetsDefinitions from './presets.js'
import * as config from './config.js'
import * as util from './util.js'
import axios from 'axios'
import http from 'http'
import https from 'https'
import PQueue from 'p-queue'

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
		this.queue = new PQueue({ concurrency: 1, interval: 100, intervalCap: 1 })
	}

	logResponse(response) {
		if (this.config.verbose) {
			console.log(response)
		}
		if (response.data !== undefined) {
			this.updateStatus(InstanceStatus.Ok)
			if (this.config.verbose) {
				this.log('debug', `Data Recieved: ${JSON.stringify(response.data)}`)
			}
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
			try {
				this.log('error', `${error.response.status}: ${JSON.stringify(error.code)}`)
				if (error.response.data.includes('401 Unauthorized')) {
					this.updateStatus(
						InstanceStatus.AuthenticationFailure,
						`${error.response.status}: ${JSON.stringify(error.code)}`,
					)
					if (this.pollTimer) {
						clearTimeout(this.pollTimer)
						delete this.pollTimer
					}
				} else {
					this.updateStatus(InstanceStatus.ConnectionFailure, `${error.response.status}: ${JSON.stringify(error.code)}`)
				}
			} catch {
				this.log('warn', `${JSON.stringify(error.code)}\n${JSON.stringify(error)}`)
				this.updateStatus(InstanceStatus.UnknownWarning, `${JSON.stringify(error.code)}`)
			}
		} else {
			this.log('error', `No error code`)
			this.updateStatus(InstanceStatus.UnknownError)
		}
	}

	pollStatus() {
		if (this.queue.size < 10) {
			this.queue.add(
				async () => {
					await this.getMode()
				},
				{ priority: 0 },
			)
			this.queue.add(
				async () => {
					await this.getChannel()
				},
				{ priority: 0 },
			)
			this.queue.add(
				async () => {
					await this.getVolume()
				},
				{ priority: 0 },
			)
			this.queue.add(
				async () => {
					await this.getMute()
				},
				{ priority: 0 },
			)
			this.queue.add(
				async () => {
					await this.getTeletext()
				},
				{ priority: 0 },
			)
			this.queue.add(
				async () => {
					await this.getChannelList()
				},
				{ priority: 0 },
			)
		}

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
		this.queue.clear()
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
		this.queue.clear()
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
