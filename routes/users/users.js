/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const express = require('express');
const cloudinary = require('cloudinary');
const multer = require('multer');
const validateProfile = require('../../validations/users/profile');
const User = require('../../models/User');
const { fileFilter, storage } = require('../../configs/uploadImage');

const upload = multer({ storage, fileFilter });

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET user profile. */
router.get('/profile', (req, res, next) => {
  res.json(req.user);
});
router.post('/update', upload.single('image'), async (req, res, next) => {
  const { errors, isValid } = validateProfile(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const oldProfile = req.user;
  if (req.body.name) oldProfile.name = req.body.name;
  if (req.body.email) oldProfile.email = req.body.email;
  if (req.body.gender) oldProfile.gender = req.body.gender;
  if (req.file) {
    try {
      await cloudinary.v2.uploader
        .upload(req.file.path, {
          folder: 'images/users',
          aspect_ratio: 1.1,
          gravity: 'face',
          crop: 'lfill'
        })
        // eslint-disable-next-line no-return-assign
        .then(res_ => (oldProfile.image = res_.secure_url));
    } catch (error) {
      errors.FileUpload = 'Error Upload Image';
      return res.status(400).json(errors);
    }
  }

  await User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    req.user._id,
    {
      $set: oldProfile
    },
    { new: true }
  )
    .then(_user => res.json(_user))
    .catch(err => res.json(err));
});
// router.post("/update/password", (req, res, next) => {
//   const { errors, isValid } = validatePassword(req.body);
//   // Check Validation
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
//   const Package = {};
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(req.body.password, salt, (err, hash) => {
//       Package.password = hash;
//       console.log({ user: req.user });

//       User.findByIdAndUpdate(req.user, { $set: Package }, { new: true })
//         .then(user => {
//           req.login(user, { session: false }, err => {
//             if (err) {
//               res.send(err);
//             }
//             const payload = { id: user.id, name: user.name };
//             const token = jwt.sign(
//               payload,
//               process.env.JWT_SECRET,
//               {
//                 expiresIn: 3600
//               },
//               (err, token) => res.json({ user, token: `Bearer ${token}` })
//             );
//           });
//         })
//         .catch(err => res.json({ ERRFindUSER: err }));
//     });
//   });
// });
router.delete('/', (req, res) => {
  // Cần thêm check role middleware đê lấy quyền xoá
  User.findOneAndRemove({ _id: req.user.id }).then(() => {
    res.json({ success: true });
  });
});
module.exports = router;
