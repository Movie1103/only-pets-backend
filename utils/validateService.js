const createError = require('../utils/createError');

module.exports = (data, file) => {
  const {
    title,
    openAt,
    closeAt,
    phoneNumber,
    category,
    address: { detail, subDistrict, district, province, zipcode },
    location: { latitude, longitude },
  } = data;

  if (!file) {
    createError('cover photo is required', 400);
  }
  if (!title) {
    createError('title is required', 400);
  }
  if (!openAt) {
    createError('openning time is required', 400);
  }
  if (!closeAt) {
    createError('closing time is required', 400);
  }
  if (!phoneNumber) {
    createError('phone number is required', 400);
  }
  if (!category) {
    createError('category is required', 400);
  }
  if (!detail) {
    createError('address is required', 400);
  }
  if (!subDistrict) {
    createError('sub-district is required', 400);
  }
  if (!district) {
    createError('district is required', 400);
  }
  if (!province) {
    createError('province is required', 400);
  }
  if (!zipcode) {
    createError('zipcode is required', 400);
  }
  if (!latitude) {
    createError('latitude is required', 400);
  }
  if (!longitude) {
    createError('longitude is required', 400);
  }
};
