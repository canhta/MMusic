/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const router = require('express').Router();
const passport = require('passport');
const PlayList = require('../../models/PlayList');
const Album = require('../../models/Album');
const User = require('../../models/User');
const Track = require('../../models/Track');

const validatePlayList = require('../../validations/apis/playList');
// Get list playList
router.get('/', (req, res, next) => {
  PlayList.find()
    .sort({ name: -1 })
    .then(playList => res.json(playList))
    .catch(err =>
      res.status(404).json({ noplayListFounds: `No playLists found: ${err}` })
    );
});
router.get(
  '/owner',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    PlayList.find({ owner: req.user.id })
      .sort({ name: -1 })
      .then(playList => res.json(playList))
      .catch(err =>
        res.status(404).json({ noplayListFounds: `No playLists found: ${err}` })
      );
  }
);
router.get('/public', (req, res, next) => {
  PlayList.find({ publics: true })
    .sort({ name: -1 })
    .then(playList => res.json(playList))
    .catch(err =>
      res.status(404).json({ noplayListFounds: `No playLists found: ${err}` })
    );
});
// router.get('/', (req, res, next) => {
//   PlayList.find({ owner: req.user.id })
//     .sort({ name: -1 })
//     .then(playList => res.json(playList))
//     .catch(err =>
//       res.status(404).json({ noplayListFounds: `No playLists found: ${err}` })
//     );
// });
// chuyển playlist sang public hoặc ngược lại phụ thuộc vào query
router.post(
  '/toPublic/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    PlayList.findById(req.params.id)
      .then(playlist => {
        const isPublic = req.query.public === '1';
        // eslint-disable-next-line no-param-reassign
        playlist.publics = isPublic;
        playlist.save().then(playlist_ => res.json(playlist_));
      })
      .catch(err =>
        res.status(404).json({ noplaylistFounds: `No playlists found: ${err}` })
      );
  }
);

// Post create or update image
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { errors, isValid } = validatePlayList(req.body);
    const { name, publics, description, image } = req.body;
    const newPlayList = {};
    if (!isValid) {
      return res.status(400).json(errors);
    }
    newPlayList.owner = req.user.id;
    if (name) newPlayList.name = name;
    if (description) newPlayList.description = description;
    if (image) newPlayList.image = image;
    if (publics) newPlayList.publics = publics;

    new PlayList(newPlayList)
      .save()
      .then(playList => res.json(playList))
      .catch(err => {
        errors.CreatePlayList = err;
        return errors;
      });
  }
);

router.post(
  '/add/:id/:track_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    PlayList.findById(req.params.id)
      .then(playList => {
        if (req.user.id !== playList.owner) {
          return res.status(404).json({
            PerrmissionErr: "You don't have perrmission to access this."
          });
        }
        Track.findById(req.params.track_id)
          .then(track => {
            playList.tracks.unshift({ track: track.id });
            playList.save().then(__playList => res.json(__playList));
          })
          .catch(err => {
            res.status(404).json({ noPostFound: 'Not post found' });
          });
      })
      .catch(err =>
        res.status(400).json({ PlaylistErrors: 'PlayList not found' })
      );
  }
);
router.post(
  '/remove/:id/:track_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    PlayList.findById(req.params.id)
      .then(playList => {
        if (req.user.id !== playList.owner) {
          return res.status(404).json({
            PerrmissionErr: "You don't have perrmission to access this."
          });
        }
        const removeIndex = playList.tracks
          .map(value => value.track.id)
          .indexOf(req.params.track_id);
        // Remove out array likes
        playList.tracks.splice(removeIndex, 1);
        playList.save().then(pl => res.json(pl));
      })
      .catch(err => {
        res.status(404).json({ noPostFound: 'Not post found.' });
      });
  }
);

router.delete(
  '/delete/:playList_id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    PlayList.findByIdAndRemove(req.params.playList_id)
      .then((haha, hihi) => res.json({ Success: true }))
      .catch(err => res.status(400).json(`PlayList not found: ${err}`));
  }
);

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.findById(req.user.id)
      .then(_user => {
        PlayList.findById(req.params.id)
          .then(playlist => {
            if (
              playlist.likes.filter(
                like => like.user.toString() === req.user.id
              ).length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyLike: 'User already liked this post' });
            }
            playlist.likes.unshift({ user: req.user.id });
            playlist.save().then(__playlist => res.json(__playlist));
          })
          .catch(err => {
            res.status(404).json({ noPostFound: 'Not post found' });
          });
      })
      .catch(err => res.status(400).json({ UserErrors: 'USER not found' }));
  }
);
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.findById(req.user.id)
      .then(_user => {
        PlayList.findById(req.params.id)
          .then(playlist => {
            if (
              playlist.likes.filter(
                like => like.user.toString() === req.user.id
              ).length === 0
            ) {
              return res
                .status(400)
                .json({ notLike: 'You has not like this post yet.' });
            }
            const removeIndex = playlist.likes
              .map(value => value.user.toString())
              .indexOf(req.params.id);
            // Remove out array likes
            playlist.likes.splice(removeIndex, 1);
            playlist.save().then(post => res.json(post));
          })
          .catch(err => {
            res.status(404).json({ noPostFound: 'Not post found.' });
          });
      })
      .catch(err => res.status(400).json({ UserErrors: 'USER not found' }));
  }
);
module.exports = router;
