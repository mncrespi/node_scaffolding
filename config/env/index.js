import _ from 'lodash'
import defaults from './defaults.js'
import enviroments from './enviroments.js'

// Merge Config's
const config = _.assign(defaults, enviroments)

export default config
