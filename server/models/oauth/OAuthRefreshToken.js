import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthRefreshTokenSchema = new Schema({
  refresh_token: String,
  expires: Date,
  scope: String,
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  OAuthClient: {
    type: Schema.Types.ObjectId,
    ref: 'OAuthClient',
  },
})

export default mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema)
