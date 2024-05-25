const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Role = require("../database/models/role.model");

describe("Role API", () => {
    beforeAll(async () => {
        // Connect to a test database
        const url = `mongodb://127.0.0.1:27017/deal`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    afterEach(async () => {
        // Clean up after each test
        await Role.deleteMany({});
    });

    afterAll(async () => {
        // Disconnect from test database
        await mongoose.connection.close();
    });

    describe("POST /api/roles", () => {
        it("should create a new role", async () => {
            const res = await request(app).post("/api/roles").send({
                roleTitle: "Admin",
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id");
            expect(res.body.data).toHaveProperty("roleTitle", "Admin");
            expect(res.body).toHaveProperty(
                "message",
                "Role created successfully"
            );
        });
    });

    describe("GET /api/roles/:roleId", () => {
        it("should get a role by ID", async () => {
            const role = new Role({
                roleTitle: "Admin",
            });
            await role.save();

            console.log(role);
            const res = await request(app).get(`/api/roles/${role._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", role._id.toString());
            expect(res.body.data).toHaveProperty("roleTitle", "Admin");
            expect(res.body).toHaveProperty(
                "message",
                "Role fetched successfully"
            );
        });

        it("should return 404 if role not found", async () => {
            const res = await request(app).get(
                "/api/roles/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Role not found");
        });
    });

    describe("GET /api/roles", () => {
        it("should get all roles", async () => {
            await Role.insertMany([
                { roleTitle: "Admin" },
                { roleTitle: "User" },
            ]);

            const res = await request(app).get("/api/roles");
            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);

            if (res.body.data.length > 0) {
                const role = res.body.data[0];
                expect(role).toHaveProperty("_id");
                expect(role).toHaveProperty("roleTitle");
            }

            expect(res.body).toHaveProperty(
                "message",
                "Roles fetched successfully"
            );
        });
    });

    describe("PUT /api/roles/:roleId", () => {
        it("should update a role by ID", async () => {
            const role = new Role({
                roleTitle: "Admin",
            });
            await role.save();

            const res = await request(app)
                .put(`/api/roles/${role._id}`)
                .send({ roleTitle: "Super Admin" });

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", role._id.toString());
            expect(res.body.data).toHaveProperty("roleTitle", "Super Admin");
            expect(res.body).toHaveProperty(
                "message",
                "Role updated successfully"
            );
        });

        it("should return 404 if role to update is not found", async () => {
            const res = await request(app)
                .put("/api/roles/60c72b2f9b1e8b3a2c8d0c39")
                .send({ roleTitle: "Super Admin" });

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Role not found");
        });
    });

    describe("DELETE /api/roles/:roleId", () => {
        it("should delete a role by ID", async () => {
            const role = new Role({
                roleTitle: "Admin",
            });
            await role.save();

            const res = await request(app).delete(`/api/roles/${role._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", role._id.toString());
            expect(res.body).toHaveProperty(
                "message",
                "Role deleted successfully"
            );

            const deletedRole = await Role.findById(role._id);
            expect(deletedRole).toBeNull();
        });

        it("should return 404 if role to delete is not found", async () => {
            const res = await request(app).delete(
                "/api/roles/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Role not found");
        });
    });
});
