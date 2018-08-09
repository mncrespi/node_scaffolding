import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthScopeSchema = new Schema({
  scope: String,
  isDefault: Boolean,
})

export default mongoose.model('OAuthScope', OAuthScopeSchema)
