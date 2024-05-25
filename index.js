const colors = require("colors");
require("dotenv").config();
const app = require("./app/app");

const RouteController = require("./app/controllers/route.controller");

const startServer = async () => {
    try {
        // Initialize routes in the database
        await RouteController.initializeRoutes(app);

        app.listen(process.env.PORT, () => {
            console.log(
                `http://localhost:${process.env.PORT}`.bold.brightBlue.underline
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();
