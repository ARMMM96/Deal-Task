const User = require("../database/models/user.model");

class UserService {
    static async register(userData) {
        const { phoneNumber } = userData;

        // Check if a user with the same phone number already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            throw new Error("Phone number already in use");
        }

        const user = new User(userData);
        await user.save();
        const token = await user.generateAuthToken();
        return { user, token };
    }
    static async login(phone, password) {
        const user = await User.findByCredentials(phone, password);
        const token = await user.generateAuthToken();
        return { user, token };
    }

    static async getUserById(userId) {
        return await User.findById(userId);
    }

    static async updateUser(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            return false;
        }
        Object.keys(updateData).forEach((key) => (user[key] = updateData[key]));
        await user.save();
        return user;
    }

    static async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return false;
        }
        return user;
    }

    static async getAllUsers() {
        return await User.find({});
    }
}

module.exports = UserService;
