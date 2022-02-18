const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('fetching users failed', 500);
    return next(error);
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid input passed, please check your data', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed please try again later',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already. please login instead!',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://www.pinkvilla.com/files/styles/amp_metadata_content_image/public/tom_holland_instagram.jpeg',
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Failed creating user please try again', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Login failed please try again', 422);
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Login failed please try again', 422);
    return next(error);
  }
  res
    .status(200)
    .json({
      message: 'Logged in!',
      user: existingUser.toObject({ getters: true }),
    });
};
