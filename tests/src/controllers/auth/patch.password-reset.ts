import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromise from "chai-as-promised";
import { app } from "../../../core/app";
import { faker } from "@faker-js/faker";
import { mockUser } from "../../../data/users/UserMock";
chai.use(chaiAsPromise);
chai.use(chaiHttp);
chai.should();
import { v4 as uuid } from "uuid";

describe("RESET PASSWORD /auth/reset-password", function () {
  const password = `Test1234!`;
  const dummyKey = uuid();
  before(async () => {
    await mockUser.create({
      dummyKey,
      password,
    });
  });
  it("should change user password", async function () {
    const res = await chai
      .request(app.app)
      .patch("/api/auth/reset-password")
      .set({
        Authorization: `Bearer ${mockUser.getToken(dummyKey)}`,
      })
      .send({
        oldPassword: password,
        newPassword: `Test678!2`,
      });
    res.should.have.status(200);
    res.body.should.have.property("success").equal(true);
  });
});
