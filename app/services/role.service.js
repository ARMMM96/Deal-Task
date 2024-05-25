const Role = require("../database/models/role.model");

class RoleService {
    static async createRole(roleData) {
        const role = new Role(roleData);
        await role.save();
        return role;
    }

    static async getRoleById(roleId) {
        return await Role.findById(roleId);
    }

    static async getAllRoles() {
        return await Role.find({});
    }

    static async updateRole(roleId, updateData) {
        const role = await Role.findById(roleId);
        if (!role) {
            return false;
        }
        Object.keys(updateData).forEach((key) => (role[key] = updateData[key]));
        await role.save();
        return role;
    }

    static async deleteRole(roleId) {
        const role = await Role.findByIdAndDelete(roleId);
        if (!role) {
            return false;
        }
        return role;
    }
}

module.exports = RoleService;
