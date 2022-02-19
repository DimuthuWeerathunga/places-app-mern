const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

let DUMMY_PLACES = [
  {
    title: 'Empire state building',
    description: 'One of the most famous sky scrapers in the world',
    imageUrl:
      'https://www.thoughtco.com/thmb/Vc_NzNjjvF7WufBlHVKnRPNeFmo=/2000x1333/filters:fill(auto,1)/187410874_HighRes-resize-56a48d293df78cf77282efa6.jpg',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
  {
    title: 'Empire state building',
    description: 'One of the most famous sky scrapers in the world',
    imageUrl:
      'https://www.thoughtco.com/thmb/Vc_NzNjjvF7WufBlHVKnRPNeFmo=/2000x1333/filters:fill(auto,1)/187410874_HighRes-resize-56a48d293df78cf77282efa6.jpg',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
];

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'cound not find the place for the given id',
      404
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id', 404)
    );
  }
  place = place.toObject({ getters: true });
  place.addedOnServer = 'this post is added by the server';

  console.log('Converted Object - ', place);

  res.json({ place });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'could not find places for the given user id',
      404
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError('Invalid input passed, please check your data', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://www.thoughtco.com/thmb/Vc_NzNjjvF7WufBlHVKnRPNeFmo=/2000x1333/filters:fill(auto,1)/187410874_HighRes-resize-56a48d293df78cf77282efa6.jpg',
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id',
      404
    );
    return next(error);
  }

  // console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid input passed, please check your data', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong could not update the place',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong could not delete the place',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find the place for the id', 404);
    next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong could not delete the place',
      500
    );
  }
  res.status(200).json({ message: 'Deleted place' });
};