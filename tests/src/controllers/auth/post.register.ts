import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromise from "chai-as-promised";
import { app } from "../../../core/app";
import { faker } from "@faker-js/faker";
chai.use(chaiAsPromise);
chai.use(chaiHttp);
chai.should();

describe("REGISTER USER /auth/register", function () {
  const userDetails = {
    email: faker.internet.email(),
    password: `Test12345!`,
    role: "admin",
  };
  it("should register user", async function () {
    const res = await chai
      .request(app.app)
      .post("/v1/auth/register")
      .send(userDetails);
    res.should.have.status(201);
    res.body.should.have.property("success").equal(true);
    res.body.should.have.property("response");
    res.body.response.should.have.property("createdUser");
    res.body.response.createdUser.should.have
      .property("role")
      .eql(userDetails.role);
    res.body.response.createdUser.should.have
      .property("email")
      .eql(userDetails.email);
    res.body.response.createdUser.should.have
      .property("status")
      .eql("active");
  });
});
