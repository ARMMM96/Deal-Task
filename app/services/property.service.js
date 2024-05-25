const Property = require("../database/models/property.model");

class PropertyService {
    static async createProperty(propertyData) {
        const property = new Property(propertyData);
        await property.save();
        return property;
    }

    static async getPropertyById(propertyId) {
        return await Property.findById(propertyId).populate("createdBy");
    }

    static async updateProperty(propertyId, updateData) {
        const property = await Property.findByIdAndUpdate(
            propertyId,
            updateData,
            { new: true }
        );
        return property;
    }

    static async deleteProperty(propertyId) {
        const property = await Property.findByIdAndDelete(propertyId);
        return property;
    }

    static async getAllProperties() {
        return await Property.find({}).populate("createdBy");
    }
    static async getUserStatistics(userId) {
        try {
            // Aggregate ads statistics for the user
            const adsStats = await Property.aggregate([
                { $match: { createdBy: userId, type: "Ad" } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        totalAmount: { $sum: "$price" },
                    },
                },
            ]);

            // Aggregate requests statistics for the user
            const requestsStats = await Request.aggregate([
                { $match: { createdBy: userId, type: "PropertyRequest" } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        totalAmount: { $sum: "$price" },
                    },
                },
            ]);

            // Construct response data
            const userStats = {
                adsCount: adsStats.length > 0 ? adsStats[0].count : 0,
                totalAdsAmount:
                    adsStats.length > 0 ? adsStats[0].totalAmount : 0,
                requestsCount:
                    requestsStats.length > 0 ? requestsStats[0].count : 0,
                totalRequestsAmount:
                    requestsStats.length > 0 ? requestsStats[0].totalAmount : 0,
            };

            return userStats;
        } catch (error) {
            throw new Error("Failed to retrieve user statistics");
        }
    }
}

module.exports = PropertyService;
