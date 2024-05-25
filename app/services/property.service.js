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
}

module.exports = PropertyService;
