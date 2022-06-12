const createError = require('../utils/createError');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const genToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail) {
      createError('username or email is required', 400);
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    if (!user) {
      createError('invalid credential', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError('invalid credential');
    }

    const token = genToken({ id: user.id });

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password, confirmPassword } =
      req.body;
    console.log(req.body);

    if (!username) {
      createError('username is required', 400);
    }
    if (!email) {
      createError('email is required', 400);
    }
    if (!password) {
      createError('password is required', 400);
    }
    if (password.length < 6) {
      createError('password must be longer than 6 characters', 400);
    }
    if (password !== confirmPassword) {
      createError('password and confirm password did not match', 400);
    }

    const isEmail = validator.isEmail(email + '');
    if (!isEmail) {
      createError('invalid email format', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    const token = genToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
