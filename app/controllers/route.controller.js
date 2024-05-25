const RouteService = require("../services/route.service");
const Helper = require("../helpers/helpers");

class RouteController {
    static async createRoute(req, res) {
        try {
            const route = await RouteService.createRoute(req.body);
            Helper.responseHandler(
                res,
                201,
                true,
                route,
                "Route created successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async getRouteById(req, res) {
        try {
            const route = await RouteService.getRouteById(req.params.routeId);
            if (!route) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Route not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                route,
                "Route fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static async getAllRoutes(req, res) {
        try {
            const routes = await RouteService.getAllRoutes();
            Helper.responseHandler(
                res,
                200,
                true,
                routes,
                "Routes fetched successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static async updateRoute(req, res) {
        try {
            const route = await RouteService.updateRoute(
                req.params.routeId,
                req.body
            );
            if (!route) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Route not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                route,
                "Route updated successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 400, false, null, error.message);
        }
    }

    static async deleteRoute(req, res) {
        try {
            const route = await RouteService.deleteRoute(req.params.routeId);
            if (!route) {
                return Helper.responseHandler(
                    res,
                    404,
                    false,
                    null,
                    "Route not found"
                );
            }
            Helper.responseHandler(
                res,
                200,
                true,
                route,
                "Route deleted successfully"
            );
        } catch (error) {
            Helper.responseHandler(res, 500, false, null, error.message);
        }
    }

    static extractRoutes(app) {
        const routes = [];
        app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                // Routes registered directly on the app
                routes.push(middleware.route);
            } else if (middleware.name === "router") {
                // Router middleware
                middleware.handle.stack.forEach((handler) => {
                    let route = handler.route;
                    route && routes.push(route);
                });
            }
        });
        return routes;
    }

    static async initializeRoutes(app) {
        const routes = this.extractRoutes(app);
        await RouteService.saveRoutesToDatabase(routes);
    }
}

module.exports = RouteController;
