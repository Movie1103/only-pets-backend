const { Review, Like, sequelize } = require('../models');
const createError = require('../utils/createError');

exports.createReview = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { title, replyToId } = req.body;
    if (!title) {
      createError('title is required', 400);
    }
    const review = await Review.create({
      title,
      serviceId,
      userId: req.user.id,
      replyToId,
    });
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { id, serviceId } = req.params;
    const { title, replyToId } = req.body;
    const review = await Review.findOne({ where: { id, serviceId } });
    if (!review) {
      createError('review not found');
    }
    if (title) {
      review.title = title;
    }
    if (replyToId) {
      review.replyToId = replyToId;
    }
    await review.save();
    res.json({ review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id, serviceId } = req.params;
    const review = await Review.findOne({ where: { id, serviceId } });
    if (!review) {
      createError('review not found');
    }
    await review.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.createLike = async (req, res, next) => {
  const t = await sequelize.transaction(); // start transaction
  try {
    const { reviewId } = req.params;
    const existLike = await Like.findOne({
      where: {
        reviewId,
        userId: req.user.id,
      },
    });

    if (existLike) {
      createError('you are already liked this review', 400);
    }

    const review = await Review.findOne({ where: { id: reviewId } });
    if (!review) {
      createError('review not found', 400);
    }

    const like = await Like.create(
      {
        reviewId,
        userId: req.user.id,
      },
      { transaction: t }
    );
    await review.increment({ like: 1 }, { transaction: t });
    await t.commit();

    res.json({ like });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction(); // start transaction
    const { reviewId } = req.params;

    const review = await Review.findOne({ where: { id: reviewId } });
    if (!review) {
      createError('review not found', 400);
    }

    const like = await Like.findOne({
      where: {
        reviewId,
        userId: req.user.id,
      },
    });

    if (!like) {
      createError("you've never liked this review", 400);
    }

    await like.destroy({ transaction: t });
    await review.decrement({ like: 1 }, { transaction: t });
    await t.commit();

    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
