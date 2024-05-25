const PropertyService = require("../services/property.service");
const Helper = require("../helpers/helpers");

class PropertyController {
    static async createProperty(req, res) {
        try {
            const property = await PropertyService.createProperty(req.body);
            Helper.responseHandler(
                res,
                201,
                true,
                property,
                "Property created successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async getPropertyById(req, res) {
        try {
            const property = await PropertyService.getPropertyById(
                req.params.propertyId
            );
            if (!property) {
                Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Property not found"
                );
                return;
            }
            Helper.responseHandler(
                res,
                200,
                true,
                property,
                "Property fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async updateProperty(req, res) {
        try {
            const property = await PropertyService.updateProperty(
                req.params.propertyId,
                req.body
            );
            if (!property) {
                Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Property not found"
                );
                return;
            }
            Helper.responseHandler(
                res,
                200,
                true,
                property,
                "Property updated successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async deleteProperty(req, res) {
        try {
            const property = await PropertyService.deleteProperty(
                req.params.propertyId
            );
            if (!property) {
                Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Property not found"
                );
                return;
            }
            Helper.responseHandler(
                res,
                200,
                true,
                property,
                "Property deleted successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async getAllProperties(req, res) {
        try {
            const properties = await PropertyService.getAllProperties();
            Helper.responseHandler(
                res,
                200,
                true,
                properties,
                "Properties fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }
    static async getUserStatistics(req, res) {
        try {
            const userId = req.params.userId;

            // Get user statistics from the property service
            const userStats = await PropertyService.getUserStatistics(userId);

            // Return response
            Helper.responseHandler(
                res,
                200,
                true,
                userStats,
                "User statistics retrieved successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }
}

module.exports = PropertyController;
