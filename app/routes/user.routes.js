const express = require('express');
const UserController = require('../controllers/user.controller');

const router = express.Router();

// Register a new user
router.post('/register', UserController.register);

// User login
router.post('/login', UserController.login);

// Get a user by ID
router.get('/:userId', UserController.getUserById);

// Update a user by ID
router.put('/:userId', UserController.updateUser);

// Delete a user by ID
router.delete('/:userId', UserController.deleteUser);

// Get all users
router.get('/', UserController.getAllUsers);

module.exports = router;
