const express = require('express');
const serviceController = require('../controllers/serviceController');
const reviewController = require('../controllers/reviewController');
const upload = require('../middlewares/upload');

const router = express.Router();

// service
router.get('/', serviceController.getAllServices);
router.post('/', upload.single('coverPhoto'), serviceController.createService);
router.patch(
  '/:id',
  upload.single('coverPhoto'),
  serviceController.updateService
);

// rating
router.post('/:serviceId/rating', serviceController.createRating);

// rate card
router.post('/:serviceId/rateCard', serviceController.addRateCard);
router.patch('/:serviceId/rateCard/:id', serviceController.updateRateCard);
router.delete('/:serviceId/rateCard/:id', serviceController.deleteRateCard);

// photo
router.post(
  '/:serviceId/photo',
  upload.single('url'),
  serviceController.addPhoto
);
router.patch(
  '/:serviceId/photo/:id',
  upload.single('url'),
  serviceController.updatePhoto
);
router.delete('/:serviceId/photo/:id', serviceController.deletePhoto);

// reviews
router.post('/:serviceId/reviews', reviewController.createReview);
router.patch('/:serviceId/reviews/:id', reviewController.updateReview);
router.delete('/:serviceId/reviews/:id', reviewController.deleteReview);

// reviews/like
router.post('/:serviceId/reviews/:reviewId/like', reviewController.createLike);
router.delete(
  '/:serviceId/reviews/:reviewId/like',
  reviewController.deleteLike
);

module.exports = router;
