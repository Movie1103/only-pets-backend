const fs = require('fs');
const {
  User,
  Service,
  Category,
  Rating,
  Address,
  Location,
  RateCard,
  Photo,
  Review,
  Like,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../utils/cloudinary');
const createError = require('../utils/createError');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
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
    const { firstName, lastName } = req.body;
    const updateValue = {};
    if (firstName !== req.user.firstName) {
      updateValue.firstName = firstName;
    }
    if (lastName !== req.user.lastName) {
      updateValue.lastName = lastName;
    }
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

exports.getUserServices = async (req, res, next) => {
  try {
    const { id } = req.user;
    const services = await Service.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Address,
          as: 'address',
        },
        {
          model: Location,
          as: 'location',
        },
        {
          model: RateCard,
          as: 'rateCard',
        },
        {
          model: Photo,
          as: 'photos',
        },
        {
          model: Review,
          as: 'reviews',
          include: {
            model: Like,
            as: 'likes',
          },
        },
      ],
    });
    console.log('service: ', services, 1239876432);
    if (!services) {
      createError('service not found', 400);
    }
    res.json({ services });
  } catch (err) {
    next(err);
  }
};
