// import path from 'path'
import _ from 'lodash'

// const env = process.env.NODE_ENV || 'development'
// const config = require(`./${env}`)
import config from './development.js'


const defaults = {
  // root: path.dirname(process.cwd()),
}

_.assign(config, defaults)

export default config
