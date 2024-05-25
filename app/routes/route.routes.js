const express = require('express');
const RouteController = require('../controllers/route.controller');

const router = express.Router();

// Create a new route
router.post('/', RouteController.createRoute);

// Get a route by ID
router.get('/:routeId', RouteController.getRouteById);

// Update a route by ID
router.put('/:routeId', RouteController.updateRoute);

// Delete a route by ID
router.delete('/:routeId', RouteController.deleteRoute);

// Get all routes
router.get('/', RouteController.getAllRoutes);

module.exports = router;
