// import path from 'path'

// Set NodeEnv
const nodeEnv = process.env.NODE_ENV || 'development'

export default {
  env: nodeEnv,
  root: process.cwd(),
  port: 3000,
}