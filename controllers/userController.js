const fs = require('fs');
const { User } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../utils/cloudinary');
const createError = require('../utils/createError');

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      createError('user not found', 400);
    }
    const result = JSON.parse(JSON.stringify(user));

    res.json({ user: result });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (!req.file) {
      createError('profilePic is required', 400);
    }
    console.log(req.file, 'testttt');

    const updateValue = {};
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      if (req.user.profilePic) {
        const splitted = req.user.profilePic.split('/');
        const publicId = splitted[splitted.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.profilePic = result.secure_url;
    }

    await User.update(updateValue, { where: { id: req.user.id } });
    res.json({ ...updateValue });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
