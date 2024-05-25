const UserService = require("../services/user.service");
const Helper = require("../helpers/helpers");

class UserController {
    static async register(req, res) {
        try {
            const { user, token } = await UserService.register(req.body);
            Helper.responseHandler(
                res,
                201,
                true,
                { user, token },
                "User registered successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async login(req, res) {
        try {
            const { phone, password } = req.body;
            const { user, token } = await UserService.login(phone, password);

            Helper.responseHandler(
                res,
                200,
                true,
                { user, token },
                "User logged in successfully"
            );
        } catch (error) {
            Helper.responseHandler(
                res,
                400,
                false,
                null,
                "Invalid login credentials"
            );
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.userId);
            if (!user) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "User not found"
                );
            }

            Helper.responseHandler(
                res,
                200,
                true,
                user,
                "User fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static async updateUser(req, res) {
        try {
            const user = await UserService.updateUser(
                req.params.userId,
                req.body
            );
            if (!user) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "User not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                user,
                "User updated successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await UserService.deleteUser(req.params.userId);
            if (!user) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "User not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                user,
                "User deleted successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            Helper.responseHandler(
                res,
                200,
                true,
                users,
                "Users fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }
}

module.exports = UserController;
