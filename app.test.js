const request = require("supertest");
const app = require("./app");

describe("Statistical Operations API", () => {
  test("GET /mean with valid input", async () => {
    const response = await request(app).get("/mean?nums=1,3,5,7");
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(4);
  });

  test("GET /median with valid input", async () => {
    const response = await request(app).get("/median?nums=1,3,5,7");
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(4);
  });

  test("GET /mode with valid input", async () => {
    const response = await request(app).get("/mode?nums=1,1,2,3");
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(1);
  });

  test("GET /mean with invalid number", async () => {
    const response = await request(app).get("/mean?nums=foo,2,3");
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("foo is not a number.");
  });

  test("GET /mean with no input", async () => {
    const response = await request(app).get("/mean");
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("nums are required.");
  });

  test("GET /mode with no unique mode", async () => {
    const response = await request(app).get("/mode?nums=1,2,3");
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("No unique mode exists.");
  });
});
