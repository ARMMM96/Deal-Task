const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Route = require("../database/models/route.model");
describe("Route API", () => {
    beforeAll(async () => {
        // Connect to a test database
        const url = `mongodb://127.0.0.1:27017/deal`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Clean up after all tests
        await Route.deleteMany({});
    });

    afterAll(async () => {
        // Disconnect from test database
        await mongoose.connection.close();
    });

    describe("POST /api/routes", () => {
        it("should create a new route", async () => {
            const res = await request(app)
                .post("/api/routes")
                .send({
                    url_name: "/test-route",
                    roles: ["60c72b2f9b1e8b3a2c8d0c39"],
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id");
            expect(res.body.data).toHaveProperty("url_name", "/test-route");
            expect(res.body).toHaveProperty(
                "message",
                "Route created successfully"
            );
        });
    });

    describe("GET /api/routes/:routeId", () => {
        it("should get a route by ID", async () => {
            const route = new Route({
                url_name: "/test-route",
                roles: ["60c72b2f9b1e8b3a2c8d0c39"],
            });
            await route.save();

            const res = await request(app).get(`/api/routes/${route._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", route._id.toString());
            expect(res.body).toHaveProperty(
                "message",
                "Route fetched successfully"
            );
        });

        it("should return 404 if route not found", async () => {
            const res = await request(app).get(
                "/api/routes/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Route not found");
        });
    });

    describe("GET /api/routes", () => {
        it("should get all routes", async () => {
            const route1 = new Route({
                url_name: "/route1",
                roles: ["60c72b2f9b1e8b3a2c8d0c39"],
            });
            await route1.save();

            const route2 = new Route({
                url_name: "/route2",
                roles: ["60c72b2f9b1e8b3a2c8d0c39"],
            });
            await route2.save();

            const res = await request(app).get("/api/routes");
            console.log(res.body.data.length);
            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            // Optionally, check that the array is not empty
            expect(res.body.data.length).toBeGreaterThan(0);
            // Validate the structure of the first item in the array (if it exists)
            if (res.body.data.length > 0) {
                const route = res.body.data[0];
                expect(route).toHaveProperty("_id");
                expect(route).toHaveProperty("url_name");
                expect(route).toHaveProperty("roles");
                expect(Array.isArray(route.roles)).toBe(true);
            }
            expect(res.body).toHaveProperty(
                "message",
                "Routes fetched successfully"
            );
        });
    });

    describe("PUT /api/routes/:routeId", () => {
        it("should update a route by ID", async () => {
            const route = new Route({
                url_name: "/test-route",
                roles: ["60c72b2f9b1e8b3a2c8d0c39"],
            });
            await route.save();

            const res = await request(app)
                .put(`/api/routes/${route._id}`)
                .send({ url_name: "/updated-route" });

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", route._id.toString());
            expect(res.body.data).toHaveProperty("url_name", "/updated-route");
            expect(res.body).toHaveProperty(
                "message",
                "Route updated successfully"
            );
        });

        it("should return 404 if route to update is not found", async () => {
            const res = await request(app)
                .put("/api/routes/60c72b2f9b1e8b3a2c8d0c39")
                .send({ url_name: "/updated-route" });

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Route not found");
        });
    });

    describe("DELETE /api/routes/:routeId", () => {
        it("should delete a route by ID", async () => {
            const route = new Route({
                url_name: "/test-route",
                roles: ["60c72b2f9b1e8b3a2c8d0c39"],
            });
            await route.save();

            const res = await request(app).delete(`/api/routes/${route._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", route._id.toString());
            expect(res.body).toHaveProperty(
                "message",
                "Route deleted successfully"
            );
        });

        it("should return 404 if route to delete is not found", async () => {
            const res = await request(app).delete(
                "/api/routes/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Route not found");
        });
    });
});
