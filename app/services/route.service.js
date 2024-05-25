const Route = require("../database/models/route.model");

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
        return await Route.findByIdAndUpdate(routeId, updateData, {
            new: true,
        });
    }

    static async deleteRoute(routeId) {
        return await Route.findByIdAndDelete(routeId);
    }
    static async findRouteByName(url_name) {
        return await Route.findOne({ url_name });
    }

    static async createRoute(url_name) {
        return await Route.create({ url_name, roles: [] });
    }

    static async saveRoutesToDatabase(routes) {
        for (const route of routes) {
            try {
                const url = Object.keys(route.methods)[0] + " " + route.path;
                const existingRoute = await this.findRouteByName(url);
                if (!existingRoute) {
                    await this.createRoute(url);
                }
            } catch (error) {
                console.error(`Failed to save route ${route.path}:`, error);
            }
        }
    }
}

module.exports = RouteService;
