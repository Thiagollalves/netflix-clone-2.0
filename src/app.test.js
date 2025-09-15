const request = require("supertest");
const app = require("./app");

describe("Express App", () => {
  test("GET / responds with 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

