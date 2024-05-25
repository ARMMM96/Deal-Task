const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Property = require("../database/models/property.model");
const User = require("../database/models/user.model");

describe("Property API", () => {
    let userId;

    beforeAll(async () => {
        // Connect to a test database
        const url = `mongodb://127.0.0.1:27017/deal`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a test user
        const user = new User({
            name: "Test User",
            phoneNumber: "1234567890",
            password: "Password1!",
            role: new mongoose.Types.ObjectId(), // Assuming roles are being handled elsewhere
            tokens: [],
        });
        await user.save();
        userId = user._id;
    });

    afterAll(async () => {
        // Disconnect from test database
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Clean up after each test
        await Property.deleteMany({});
    });

    describe("POST /api/properties", () => {
        it("should create a new property", async () => {
            const res = await request(app).post("/api/properties").send({
                type: "Ad",
                propertyType: "VILLA",
                area: "Downtown",
                price: 1000000,
                city: "TestCity",
                district: "TestDistrict",
                description: "A beautiful villa",
                createdBy: userId,
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty("_id");
            expect(res.body.data).toHaveProperty("type", "Ad");
            expect(res.body.data).toHaveProperty("propertyType", "VILLA");
            expect(res.body).toHaveProperty(
                "message",
                "Property created successfully"
            );
        });
    });

    describe("GET /api/properties/:propertyId", () => {
        it("should get a property by ID", async () => {
            const property = new Property({
                type: "Ad",
                propertyType: "VILLA",
                area: "Downtown",
                price: 1000000,
                city: "TestCity",
                district: "TestDistrict",
                description: "A beautiful villa",
                createdBy: userId,
            });
            await property.save();

            const res = await request(app).get(
                `/api/properties/${property._id}`
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty(
                "_id",
                property._id.toString()
            );
            expect(res.body).toHaveProperty(
                "message",
                "Property fetched successfully"
            );
        });

        it("should return 404 if property not found", async () => {
            const res = await request(app).get(
                "/api/properties/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Property not found");
        });
    });

    describe("GET /api/properties", () => {
        it("should get all properties", async () => {
            await Property.insertMany([
                {
                    type: "Ad",
                    propertyType: "VILLA",
                    area: "Downtown",
                    price: 1000000,
                    city: "TestCity",
                    district: "TestDistrict",
                    description: "A beautiful villa",
                    createdBy: userId,
                },
                {
                    type: "Ad",
                    propertyType: "HOUSE",
                    area: "Uptown",
                    price: 500000,
                    city: "TestCity",
                    district: "TestDistrict",
                    description: "A cozy house",
                    createdBy: userId,
                },
            ]);

            const res = await request(app).get("/api/properties");
            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);

            if (res.body.data.length > 0) {
                const property = res.body.data[0];
                expect(property).toHaveProperty("_id");
                expect(property).toHaveProperty("type");
                expect(property).toHaveProperty("propertyType");
                expect(property).toHaveProperty("city");
                expect(property).toHaveProperty("district");
            }

            expect(res.body).toHaveProperty(
                "message",
                "Properties fetched successfully"
            );
        });
    });

    describe("PUT /api/properties/:propertyId", () => {
        it("should update a property by ID", async () => {
            const property = new Property({
                type: "Ad",
                propertyType: "VILLA",
                area: "Downtown",
                price: 1000000,
                city: "TestCity",
                district: "TestDistrict",
                description: "A beautiful villa",
                createdBy: userId,
            });
            await property.save();

            const res = await request(app)
                .put(`/api/properties/${property._id}`)
                .send({ price: 1200000 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty(
                "_id",
                property._id.toString()
            );
            expect(res.body.data).toHaveProperty("price", 1200000);
            expect(res.body).toHaveProperty(
                "message",
                "Property updated successfully"
            );
        });

        it("should return 404 if property to update is not found", async () => {
            const res = await request(app)
                .put("/api/properties/60c72b2f9b1e8b3a2c8d0c39")
                .send({ price: 1200000 });

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Property not found");
        });
    });

    describe("DELETE /api/properties/:propertyId", () => {
        it("should delete a property by ID", async () => {
            const property = new Property({
                type: "Ad",
                propertyType: "VILLA",
                area: "Downtown",
                price: 1000000,
                city: "TestCity",
                district: "TestDistrict",
                description: "A beautiful villa",
                createdBy: userId,
            });
            await property.save();

            const res = await request(app).delete(
                `/api/properties/${property._id}`
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.apiStatus).toBe(true);
            expect(res.body.data).toHaveProperty(
                "_id",
                property._id.toString()
            );
            expect(res.body).toHaveProperty(
                "message",
                "Property deleted successfully"
            );
        });

        it("should return 404 if property to delete is not found", async () => {
            const res = await request(app).delete(
                "/api/properties/60c72b2f9b1e8b3a2c8d0c39"
            );

            expect(res.statusCode).toEqual(404);
            expect(res.body.apiStatus).toBe(false);
            expect(res.body).toHaveProperty("message", "Property not found");
        });
    });
});
