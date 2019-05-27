const mongoose = require('mongoose');

const { Schema } = mongoose;
const ArtistSchema = new Schema({
  image: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  albums: [
    {
      type: Schema.Types.ObjectId,
      ref: 'albums'
    }
  ],
  genres: [
    {
      type: Schema.Types.ObjectId,
      ref: 'genres'
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  description: {
    type: String
  }
});
const Artist = mongoose.model('artists', ArtistSchema);
module.exports = Artist;
