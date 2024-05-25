const express = require('express');
const PropertyController = require('../controllers/property.controller');

const router = express.Router();

// Create a new property
router.post('/', PropertyController.createProperty);

// Get a property by ID
router.get('/:propertyId', PropertyController.getPropertyById);

// Update a property by ID
router.put('/:propertyId', PropertyController.updateProperty);

// Delete a property by ID
router.delete('/:propertyId', PropertyController.deleteProperty);

// Get all properties
router.get('/', PropertyController.getAllProperties);

module.exports = router;
