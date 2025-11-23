import request from "supertest";
import mongoose from "mongoose";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import postsRouter from "../src/api/posts.routes";
import authorsRouter from "../src/api/authors/authors.routes";
import notFound from "../src/middlewares/NotFound";
import errorHandler from "../src/middlewares/ErrorHandler";
import Author from "../src/models/Author";
import Post from "../src/models/Post";

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use("/posts", postsRouter);
    app.use("/authors", authorsRouter);
    app.use(notFound);
    app.use(errorHandler);
    return app;
};

const app = createTestApp();
let mongoServer: MongoMemoryServer;

// Connect to in-memory database
const connectTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
};

// Disconnect and stop in-memory database
const disconnectTestDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

describe("Blog API Tests", () => {
    let testAuthorId: string;
    let testPostId: string;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        // Clean up test data
        if (mongoose.connection.readyState === 1) {
            await Author.deleteMany({});
            await Post.deleteMany({});
        }
        await disconnectTestDB();
    });

    describe("Authors Endpoints", () => {
        describe("POST /authors", () => {
            it("should create a new author", async () => {
                const authorData = {
                    name: "Test Author",
                };

                const response = await request(app)
                    .post("/authors")
                    .send(authorData)
                    .expect(201);

                expect(response.body).toHaveProperty("_id");
                expect(response.body.name).toBe(authorData.name);
                expect(response.body).toHaveProperty("posts");
                expect(response.body).toHaveProperty("createdAt");

                testAuthorId = response.body._id;
            });

            it("should return 500 if name is missing", async () => {
                const response = await request(app)
                    .post("/authors")
                    .send({})
                    .expect(500);

                expect(response.body).toHaveProperty("message");
            });
        });

        describe("GET /authors", () => {
            it("should get all authors", async () => {
                const response = await request(app)
                    .get("/authors")
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
            });
        });

        describe("GET /authors/:id", () => {
            it("should get an author by id", async () => {
                const response = await request(app)
                    .get(`/authors/${testAuthorId}`)
                    .expect(200);

                expect(response.body).toHaveProperty("_id");
                expect(response.body._id).toBe(testAuthorId);
                expect(response.body.name).toBe("Test Author");
            });

            it("should return null for non-existent author", async () => {
                const fakeId = new mongoose.Types.ObjectId().toString();
                const response = await request(app)
                    .get(`/authors/${fakeId}`)
                    .expect(200);

                expect(response.body).toBeNull();
            });
        });

        describe("PUT /authors/:id", () => {
            it("should update an author", async () => {
                const updateData = {
                    name: "Updated Author Name",
                };

                const response = await request(app)
                    .put(`/authors/${testAuthorId}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body.name).toBe(updateData.name);
                expect(response.body._id).toBe(testAuthorId);
            });

            it("should return 500 for invalid id", async () => {
                const response = await request(app)
                    .put("/authors/invalid-id")
                    .send({ name: "Test" })
                    .expect(500);
            });
        });

        describe("DELETE /authors/:id", () => {
            it("should delete an author", async () => {
                // Create another author to delete
                const author = await Author.create({ name: "Author to Delete" });
                const authorId = author._id.toString();

                const response = await request(app)
                    .delete(`/authors/${authorId}`)
                    .expect(200);

                expect(response.body).toHaveProperty("message", "Author deleted");

                // Verify author is deleted
                const deletedAuthor = await Author.findById(authorId);
                expect(deletedAuthor).toBeNull();
            });
        });
    });

    describe("Posts Endpoints", () => {
        describe("POST /posts", () => {
            it("should create a new post", async () => {
                const postData = {
                    title: "Test Post",
                    body: "This is a test post body",
                    author: testAuthorId,
                };

                const response = await request(app)
                    .post("/posts")
                    .send(postData)
                    .expect(201);

                expect(response.body).toHaveProperty("_id");
                expect(response.body.title).toBe(postData.title);
                expect(response.body.body).toBe(postData.body);
                expect(response.body.author).toBe(testAuthorId);
                expect(response.body).toHaveProperty("createdAt");

                testPostId = response.body._id;
            });

            it("should return 500 if required fields are missing", async () => {
                const response = await request(app)
                    .post("/posts")
                    .send({
                        title: "Test Post",
                        // Missing body and author
                    })
                    .expect(500);

                expect(response.body).toHaveProperty("message");
            });
        });

        describe("GET /posts", () => {
            it("should get all posts", async () => {
                const response = await request(app)
                    .get("/posts")
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
            });
        });

        describe("GET /posts/:id", () => {
            it("should get a post by id", async () => {
                const response = await request(app)
                    .get(`/posts/${testPostId}`)
                    .expect(200);

                expect(response.body).toHaveProperty("_id");
                expect(response.body._id).toBe(testPostId);
                expect(response.body.title).toBe("Test Post");
                expect(response.body.author).toBe(testAuthorId);
            });

            it("should return null for non-existent post", async () => {
                const fakeId = new mongoose.Types.ObjectId().toString();
                const response = await request(app)
                    .get(`/posts/${fakeId}`)
                    .expect(200);

                expect(response.body).toBeNull();
            });
        });

        describe("PUT /posts/:id", () => {
            it("should update a post", async () => {
                const updateData = {
                    title: "Updated Post Title",
                    body: "Updated post body",
                };

                const response = await request(app)
                    .put(`/posts/${testPostId}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body.title).toBe(updateData.title);
                expect(response.body.body).toBe(updateData.body);
                expect(response.body._id).toBe(testPostId);
            });

            it("should return 500 for invalid id", async () => {
                const response = await request(app)
                    .put("/posts/invalid-id")
                    .send({ title: "Test" })
                    .expect(500);
            });
        });

        describe("DELETE /posts/:id", () => {
            it("should delete a post", async () => {
                // Create another post to delete
                const post = await Post.create({
                    title: "Post to Delete",
                    body: "This post will be deleted",
                    author: testAuthorId,
                });
                const postId = post._id.toString();

                const response = await request(app)
                    .delete(`/posts/${postId}`)
                    .expect(200);

                expect(response.body).toHaveProperty("message", "Post deleted");

                // Verify post is deleted
                const deletedPost = await Post.findById(postId);
                expect(deletedPost).toBeNull();
            });
        });
    });

    describe("Error Handling", () => {
        it("should return 404 for non-existent routes", async () => {
            const response = await request(app)
                .get("/nonexistent")
                .expect(404);

            expect(response.body).toHaveProperty("message", "Route not found");
        });
    });

    describe("Relationships", () => {
        it("should maintain relationship between author and posts", async () => {
            // Create a new author
            const author = await Author.create({ name: "Author with Posts" });
            const authorId = author._id.toString();

            // Create posts for this author
            const post1 = await Post.create({
                title: "Post 1",
                body: "Body 1",
                author: authorId,
            });

            const post2 = await Post.create({
                title: "Post 2",
                body: "Body 2",
                author: authorId,
            });

            // Verify posts reference the author
            const fetchedPost1 = await Post.findById(post1._id);
            const fetchedPost2 = await Post.findById(post2._id);

            expect(fetchedPost1?.author.toString()).toBe(authorId);
            expect(fetchedPost2?.author.toString()).toBe(authorId);

            // Clean up
            await Post.deleteMany({ _id: { $in: [post1._id, post2._id] } });
            await Author.findByIdAndDelete(authorId);
        });
    });
});

