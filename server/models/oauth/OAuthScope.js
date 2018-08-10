import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthScopeSchema = new Schema({
  scope: {
    type: String,
    lowercase: true,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model('OAuthScope', OAuthScopeSchema)
