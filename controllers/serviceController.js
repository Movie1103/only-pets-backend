const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const validateService = require('../utils/validateService');
const createError = require('../utils/createError');
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

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'serviceId'],
          },
        },
        {
          model: Address,
          as: 'address',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'serviceId'],
          },
        },
        {
          model: Location,
          as: 'location',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'serviceId'],
          },
        },
        {
          model: RateCard,
          as: 'rateCard',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'serviceId'],
          },
        },
        {
          model: Photo,
          as: 'photos',
          order: [['createdAt', 'DESC']],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'serviceId'],
          },
        },
        {
          model: Review,
          as: 'reviews',
          order: [['createdAt', 'DESC']],
          attributes: {
            exclude: ['serviceId'],
          },
          include: {
            model: Like,
            as: 'likes',
          },
        },
      ],
    });
    res.json({ services });
  } catch (err) {
    next(err);
  }
};

exports.createService = async (req, res, next) => {
  const body = req.body;
  const category = JSON.parse(body.category);
  const address = JSON.parse(body.address);
  const location = JSON.parse(body.location);
  const t = await sequelize.transaction();
  try {
    const { title, openAt, closeAt, phoneNumber, line, facebook, instagram } =
      body;
    const { grooming, shop, hospital, hotel } = category;
    const { detail, subDistrict, district, province, zipcode } = address;
    const { latitude, longitude } = location;

    let coverPhoto;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      coverPhoto = result.secure_url;
    }
    const data = {
      title,
      openAt,
      closeAt,
      phoneNumber,
      line,
      facebook,
      instagram,
      category,
      address,
      location,
    };

    validateService(data, req.file);

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      createError('user not found', 400);
    }

    const serviceInfo = await Service.create(
      {
        title,
        coverPhoto,
        userId: req.user.id,
        openAt,
        closeAt,
        phoneNumber,
        line,
        facebook,
        instagram,
      },
      { transaction: t }
    );
    const serviceCategory = await Category.create(
      {
        serviceId: serviceInfo.id,
        grooming,
        shop,
        hospital,
        hotel,
      },
      { transaction: t }
    );
    const serviceAddress = await Address.create(
      {
        serviceId: serviceInfo.id,
        detail,
        subDistrict,
        district,
        province,
        zipcode,
      },
      { transaction: t }
    );
    const serviceLocation = await Location.create(
      {
        serviceId: serviceInfo.id,
        latitude,
        longitude,
      },
      { transaction: t }
    );

    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save({ transaction: t });
    }
    await t.commit();
    res.json({
      service: [serviceInfo, serviceCategory, serviceAddress, serviceLocation],
    });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({ where: { id } });
    if (!service) {
      createError('service not found', 400);
    }
    if (service.userId !== req.user.id) {
      createError('you have no permission', 403);
    }

    const result = {};

    if (req.body) {
      const serviceObj = { ...req.body };
      delete serviceObj.category;
      delete serviceObj.address;
      delete serviceObj.location;

      const categoryObj = { ...req.body.category };
      const addressObj = { ...req.body.address };
      const locationObj = { ...req.body.location };

      if (serviceObj) {
        await Service.update(serviceObj, { where: { id: service.id } });
        Object.assign(result, serviceObj);
      }
      if (categoryObj) {
        await Category.update(categoryObj, {
          where: { serviceId: service.id },
        });
        const obj = {};
        obj.category = categoryObj;
        Object.assign(result, obj);
      }
      if (addressObj) {
        await Address.update(addressObj, {
          where: { serviceId: service.id },
        });
        const obj = {};
        obj.address = addressObj;
        Object.assign(result, obj);
      }
      if (locationObj) {
        await Location.update(locationObj, {
          where: { serviceId: service.id },
        });
        const obj = {};
        obj.location = locationObj;
        Object.assign(result, obj);
      }
    }

    if (req.file !== null) {
      if (service.coverPhoto) {
        const splitted = service.coverPhoto.split('/');
        const publicId = splitted[splitted.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);
      }
      const result = await cloudinary.upload(req.file.path);
      service.coverPhoto = result.secure_url;
      await service.save();
      const obj = {};
      obj.coverPhoto = service.coverPhoto;
      Object.assign(result, obj);
    }

    res.json({ service: result });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.deleteService = async (req, res, next) => {
  // const t = await sequelize.transaction();
  try {
    const { serviceId } = req.params;
    console.log(serviceId);

    const service = await Service.findOne({
      where: { id: serviceId },
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' },
      ],
    });
    console.log(service);
    const user = await User.findOne({ where: { id: req.user.id } });
    // const review = await Review.findAll({ where: { serviceId } });
    if (!service) {
      createError('service not found', 400);
      user.role = 'user';
      await user.save();
    }
    // if (review) {
    //   await Like.destroy({ where: { reviewId: review.id } });
    //   await Review.destroy({ where: { id: serviceId } });
    // }
    await Category.destroy({ where: { serviceId } });
    await Address.destroy({ where: { serviceId } });
    console.log('1');
    // await RateCard.destroy({ where: { serviceId } }, { transaction: t });
    await Location.destroy({ where: { serviceId } });
    console.log('2');
    // await Photo.destroy({ where: { serviceId } }, { transaction: t });
    // await Rating.destroy({ where: { serviceId } }, { transaction: t });
    if (service.coverPhoto) {
      const splitted = service.coverPhoto.split('/');
      const publicId = splitted[splitted.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
    }
    console.log('3');
    await Service.destroy({ where: { id: serviceId } });
    // await t.commit();
    res.status(204).json();
  } catch (err) {
    // await t.rollback();
    next(err);
  }
};

exports.createRating = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { star } = req.body;
    if (!star) {
      createError('star is required', 400);
    }
    const rating = await Rating.create({
      star,
      serviceId,
      userId: req.user.id,
    });
    res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
};

exports.deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findOne({ where: { id } });

    if (!rating) {
      createError('rating not found', 404);
    }
    await rating.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.addRateCard = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    console.log(serviceId);
    const { title, price } = req.body;
    if (!title && !price) {
      createError('title or price is required', 400);
    }
    const rateCard = await RateCard.create({ title, price, serviceId });
    res.status(201).json({ rateCard });
  } catch (err) {
    next(err);
  }
};

exports.updateRateCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;

    if (!title && !price) {
      createError('title or price is required', 400);
    }

    const rateCard = await RateCard.findOne({ where: { id } });
    if (!rateCard) {
      createError('rate card not found', 400);
    }

    if (title) {
      rateCard.title = title;
    }
    if (price) {
      rateCard.price = price;
    }
    await rateCard.save();
    res.json({ rateCard });
  } catch (err) {
    next(err);
  }
};

exports.deleteRateCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rateCard = await RateCard.findOne({ where: { id } });
    if (!rateCard) {
      createError('rate card not found', 400);
    }
    await RateCard.destroy({ where: { id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.addPhoto = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { description } = req.body;
    if (!description && !req.file) {
      createError('description or photo is required', 400);
    }
    let url;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      url = result.secure_url;
    }
    const photo = await Photo.create({ description, url, serviceId });
    res.json({ photo });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updatePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const photo = await Photo.findOne({ where: { id } });
    if (!photo) {
      createError('photo not found', 404);
    }
    if (description) {
      photo.description = description;
    }
    if (req.file) {
      if (photo.url) {
        const splitted = photo.url.split('/');
        const publicId = splitted[splitted.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);
      }
      const result = await cloudinary.upload(req.file.path);
      photo.url = result.secure_url;
    }
    await photo.save();
    res.json({ photo });
  } catch (err) {
    next(err);
  }
};

exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findOne({ where: { id } });
    if (!photo) {
      createError('photo not found', 404);
    }
    if (photo.url) {
      const splitted = post.image.split('/');
      const publicId = splitted[splitted.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
    }
    await photo.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
