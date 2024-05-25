const express = require('express');
const RoleController = require('../controllers/role.controller');

const router = express.Router();

// Create a new role
router.post('/', RoleController.createRole);

// Get a role by ID
router.get('/:roleId', RoleController.getRoleById);

// Get all roles
router.get('/', RoleController.getAllRoles);

// Update a role by ID
router.put('/:roleId', RoleController.updateRole);

// Delete a role by ID
router.delete('/:roleId', RoleController.deleteRole);

module.exports = router;
