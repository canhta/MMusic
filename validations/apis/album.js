/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('../is-empty');
const formatText = require('../formatText');

module.exports = function validateAlbum(data) {
  const errors = {};
  data.name = !isEmpty(data.name) ? formatText(data.name) : '';

  if (Validator.isEmpty(data.name)) {
    errors.album = 'Album name field is required';
  } else if (!Validator.isLength(data.name, { min: 3, max: 20 })) {
    errors.album = 'Album name is at least 3 characters';
  }
  if (Validator.isEmpty(data.image)) {
    errors.image = 'Image is required';
  } else if (!Validator.isURL(data.image)) {
    errors.image = 'Image link invalid';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
