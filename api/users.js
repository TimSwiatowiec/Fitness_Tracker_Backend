const express = require('express');
const usersRouter = express.Router();
// const usersRouter = require('express').Router();
// const { getAllUsers, getUserByUsername, createUser } = require('../db');
// const { getAllUsers, getUserByUsername, createUser, getAllPublicRoutinesByUser } = require('../db');
// const { requireUser, requireActiveUser } = require('./utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// POST /api/users/login

// POST /api/users/register

// GET /api/users/me

// GET /api/users/:username/routines

const { 
    createUser,
    getUserById,
    getUser,
    getUserByUsername,
  } = require('../db');
  
  const jwt = require('jsonwebtoken');
  
  usersRouter.get('/', async (req, res, next) => {
    const { username } = req.params;
    console.log(username);
  
    try {
      const userPublicRoutines = await getAllPublicRoutinesByUser(username);
      res.send(userPublicRoutines);
    } catch ({ name, message }) {
      next({ name, message });
    };
  });
//   usersRouter.get('/:username/routines', async (req, res, next) => {
//     const {getUsers} = req.params;
//     console.log(getUsers)

//     try {
//         const user = await getUser();
//         const hashedPassword = user.password

//         console.log(hashedPassword)
//         console.log(password)
 
//     }
// })
  
  usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  };

  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;

    console.log(hashedPassword)
    console.log(password)


    bcrypt.compare(password, hashedPassword, function (err, passwordsMatch) {
      if (passwordsMatch) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET)
        res.send({ message: "you're logged in!", token: `${token}` });

        return token;
      } else throw new Error({name: 'IncorrectCredentialsError',
            message: 'Username or password is incorrect'});
});
} catch (error) {
console.log(error);
next(error);
}
});

  
  usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
  const SALT_COUNT = 10;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    };

    if (password.length < 8) {
      next({
        name: 'PasswordTooShort',
        message: 'Password must be at least 8 characters'
      })
    };

    bcrypt.hash(password, SALT_COUNT, async function (err, hashedPassword) {
      const user = await createUser({
        username,
        password: hashedPassword,
        name,
        location,
      });

      const token = jwt.sign({
        id: user.id,
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });

      res.send({
        user,
        message: "thank you for signing up",
        token
      });
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});

  //get userById still needs to be done.
  
  module.exports = usersRouter;