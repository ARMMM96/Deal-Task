const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../database/models/user.model");

describe("User API", () => {
    beforeAll(async () => {
        // Connect to a test database
        const url = `mongodb://127.0.0.1:27017/deal`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Clean up after each test
        await User.deleteMany({});
    });
    afterAll(async () => {
        // Disconnect from test database
        await mongoose.connection.close();
    });

    describe("POST /api/users/register", () => {
        it("should register a new user", async () => {
            const res = await request(app).post("/api/users/register").send({
                name: "John Doe",
                phoneNumber: "+201112998249",
                password: "Password123!",
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data.user).toHaveProperty("_id");
            expect(res.body.data.user).toHaveProperty("name", "john doe");
            expect(res.body.data.user).toHaveProperty(
                "phoneNumber",
                "+201112998249"
            );

            expect(res.body).toHaveProperty(
                "message",
                "User registered successfully"
            );
        });

        it("should not register a user with a duplicate phone number", async () => {
            const userData = {
                name: "John Doe",
                phoneNumber: "+201112998249",
                password: "Password123!",
            };

            await request(app).post("/api/users/register").send(userData);

            const res = await request(app)
                .post("/api/users/register")
                .send(userData);

            expect(res.statusCode).toEqual(400);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty(
                "message",
                "Phone number already in use"
            );
        });
    });

    describe("POST /api/users/login", () => {
        it("should log in an existing user", async () => {
            const userData = {
                phone: "+201112998249",
                password: "Password123!",
            };

            await request(app).post("/api/users/register").send(userData);

            const res = await request(app).post("/api/users/login").send({
                phone: userData.phone,
                password: userData.password,
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data.user).toHaveProperty("_id");
            expect(res.body.data.user).toHaveProperty(
                "phoneNumber",
                userData.phone
            );
            expect(res.body).toHaveProperty(
                "message",
                "User logged in successfully"
            );
        });

        it("should not log in with invalid credentials", async () => {
            const res = await request(app).post("/api/users/login").send({
                phone: "+1111111111",
                password: "WrongPassword123!",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty(
                "message",
                "Invalid login credentials"
            );
        });
    });

    describe("GET /api/users/:userId", () => {
        it("should get a user by ID", async () => {
            const userData = {
                name: "Sam Smith",
                phoneNumber: "+201112998247",
                password: "Password123!",
            };

            const registerRes = await request(app)
                .post("/api/users/register")
                .send(userData);

            const userId = registerRes.body.data.user._id;

            const res = await request(app).get(`/api/users/${userId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", userId);
            expect(res.body.data).toHaveProperty("name", "sam smith");
            expect(res.body).toHaveProperty(
                "message",
                "User fetched successfully"
            );
        });

        it("should return 404 if user not found", async () => {
            const res = await request(app).get(
                "/api/users/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "User not found");
        });
    });

    describe("PUT /api/users/:userId", () => {
        it("should update a user by ID", async () => {
            const userData = {
                name: "Alice Wonderland",
                phoneNumber: "+201112998277",
                role: "60c72b2f9b1e8b3a2c8d0c39",
                password: "Password123!",
            };

            const registerRes = await request(app)
                .post("/api/users/register")
                .send(userData);

            const userId = registerRes.body.data.user._id;

            const updateData = {
                name: "Alice Updated",
            };

            const res = await request(app)
                .put(`/api/users/${userId}`)
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("name", "alice updated");
            expect(res.body).toHaveProperty(
                "message",
                "User updated successfully"
            );
        });

        it("should return 404 if user to update is not found", async () => {
            const res = await request(app)
                .put("/api/users/60c72b2f9b1e8b3a2c8d0c39")
                .send({ name: "Non-existent User" });

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "User not found");
        });
    });

    describe("DELETE /api/users/:userId", () => {
        it("should delete a user by ID", async () => {
            const userData = {
                name: "Bob Builder",
                phoneNumber: "+201112998345",
                role: "60c72b2f9b1e8b3a2c8d0c39",
                password: "Password123!",
            };

            const registerRes = await request(app)
                .post("/api/users/register")
                .send(userData);

            const userId = registerRes.body.data.user._id;

            const res = await request(app).delete(`/api/users/${userId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id", userId);
            expect(res.body).toHaveProperty(
                "message",
                "User deleted successfully"
            );
        });

        it("should return 404 if user to delete is not found", async () => {
            const res = await request(app).delete(
                "/api/users/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "User not found");
        });
    });
});
