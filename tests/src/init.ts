import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromise from "chai-as-promised";
import { app } from "../core/app";
chai.use(chaiAsPromise);
chai.use(chaiHttp);
chai.should();

// FIX TEST HERE
describe("/auth/health", function () {
  it("should return status 200", async function () {
    const res = await chai.request(app.app).get("/api/health/check").send();
    res.should.have.status(200);
    res.body.should.have.property("success").equal(true);
  });
});
