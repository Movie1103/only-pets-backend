const express = require('express');
const serviceController = require('../controllers/serviceController');
const reviewController = require('../controllers/reviewController');
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// service
router.get('/', serviceController.getAllServices);
router.post(
  '/',
  authenticate,
  upload.single('coverPhoto'),
  serviceController.createService
);
router.patch(
  '/:id',
  authenticate,
  upload.single('coverPhoto'),
  serviceController.updateService
);
router.delete('/:serviceId', authenticate, serviceController.deleteService);

// rating
router.post('/:serviceId/rating', authenticate, serviceController.createRating);

// rate card
router.post(
  '/:serviceId/rateCard',
  authenticate,
  serviceController.addRateCard
);
router.patch(
  '/:serviceId/rateCard/:id',
  authenticate,
  serviceController.updateRateCard
);
router.delete(
  '/:serviceId/rateCard/:id',
  authenticate,
  serviceController.deleteRateCard
);

// photo
router.post(
  '/:serviceId/photo',
  authenticate,
  upload.single('url'),
  serviceController.addPhoto
);
router.patch(
  '/:serviceId/photo/:id',
  authenticate,
  upload.single('url'),
  serviceController.updatePhoto
);
router.delete(
  '/:serviceId/photo/:id',
  authenticate,
  serviceController.deletePhoto
);

// reviews
router.post('/:serviceId/reviews', authenticate, reviewController.createReview);
router.patch(
  '/:serviceId/reviews/:id',
  authenticate,
  reviewController.updateReview
);
router.delete(
  '/:serviceId/reviews/:id',
  authenticate,
  reviewController.deleteReview
);

// reviews/like
router.post(
  '/:serviceId/reviews/:reviewId/like',
  authenticate,
  reviewController.createLike
);
router.delete(
  '/:serviceId/reviews/:reviewId/like',
  authenticate,
  reviewController.deleteLike
);

module.exports = router;
