const mongoose = require('mongoose');
/* eslint-disable */
const Schema = mongoose.Schema;
/* eslint-enable */
const IgMedia = require('./ig-media');
const Msg = require('./msg');

const influencerSchema = new Schema({
  username: String,
  role: { type: String, default: 'influencer' },
  name: { type: String, default: 'New Cofluencer' },
  lastname: String,
  email: String,
  facebookID: String,
  password: String,
  phone: Number,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  bio: String,
  influenceArea: String,
  profileImage: String,
  coverImage: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: { type: String, default: null },
    youtube: { type: String, default: null },
  },
  tags: [],
  no_read: { type: Number, default: 0 },
  messages: [Msg.schema],
  send: [Msg.schema],
  campaignsFavs: [Schema.Types.ObjectId],
  companiesFavs: [Schema.Types.ObjectId],
  followers: [Schema.Types.ObjectId],
  instagram: {
    username: String,
    biography: String,
    website: String,
    followers_count: Number,
    media_count: Number,
    media: {
      data: [IgMedia.schema],
      paging: {
        cursors: {
          before: String,
          after: String,
        },
        next: String,
      },
    },
    id: String,
  },
  stats: {
    instagram: {
      avgLikePhoto: Number,
    },
  },
  id: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
