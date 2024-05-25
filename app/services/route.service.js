const Route = require('../database/models/route.model');

class RouteService {
    static async createRoute(routeData) {
        return await Route.create(routeData);
    }

    static async getRouteById(routeId) {
        return await Route.findById(routeId);
    }

    static async getAllRoutes() {
        return await Route.find({});
    }

    static async updateRoute(routeId, updateData) {
        return await Route.findByIdAndUpdate(routeId, updateData, { new: true });
    }

    static async deleteRoute(routeId) {
        return await Route.findByIdAndDelete(routeId);
    }
}

module.exports = RouteService;
