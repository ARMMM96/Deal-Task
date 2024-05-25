const RoleService = require("../services/role.service");
const Helper = require("../helpers/helpers");

class RoleController {
    static async createRole(req, res) {
        try {
            const role = await RoleService.createRole(req.body);
            Helper.responseHandler(
                res,
                201,
                true,
                role,
                "Role created successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async getRoleById(req, res) {
        try {
            const role = await RoleService.getRoleById(req.params.roleId);
            if (!role) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Role not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                role,
                "Role fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static async getAllRoles(req, res) {
        try {
            const roles = await RoleService.getAllRoles();
            Helper.responseHandler(
                res,
                200,
                true,
                roles,
                "Roles fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static async updateRole(req, res) {
        try {
            const role = await RoleService.updateRole(
                req.params.roleId,
                req.body
            );
            if (!role) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Role not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                role,
                "Role updated successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async deleteRole(req, res) {
        try {
            const role = await RoleService.deleteRole(req.params.roleId);
            if (!role) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Role not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                role,
                "Role deleted successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }
}

module.exports = RoleController;
