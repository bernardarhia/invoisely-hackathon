
import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromise from "chai-as-promised";
import { app } from "../../../core/app";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { mockUser } from "../../../data/users/UserMock";
import { Invoice } from "../../../../database/models/Invoice";
import { omit } from "lodash";
import { httpCodes } from "../../../../constants";
import { selectRandomItem } from "../../../../utils";
import { mockInvoice } from "../../../data/invoice/InvoiceMock";
chai.use(chaiAsPromise);
chai.use(chaiHttp);
chai.should();

describe("CREATE INVOICE /invoices/create", function () {
    const dummyKey = uuid();
    const dummyKey2 = uuid();
    const dummyKey3 = uuid()
    const invoice: Invoice = {
        items: [
            {
                price: Number(faker.finance.amount()),
                product: faker.name.jobDescriptor(),
                description: faker.lorem.sentence(10),
                quantity: 2
            }
        ],
        userId: uuid()
    }
    before(async () => {
        await mockUser.create({ dummyKey, role: "admin" })
        await mockUser.create({ dummyKey: dummyKey2, role: "client", createdBy: (mockUser.getId(dummyKey)) })
        await mockInvoice.create({ dummyKey: dummyKey3, createdBy: (mockUser.getId(dummyKey)), userId: mockUser.getId(dummyKey2) })
    })

    it(`should ge invoice admin created`, async function () {
        const res = await chai
            .request(app.app)
            .get(`/v1/${mockInvoice.getId(dummyKey3)}/invoices`)
            .set({
                Authorization: `Bearer ${mockUser.getToken(dummyKey)}`,
            })

        res.status.should.be.a("number").eql(200)
        res.body.should.have.property("response")
    });
});
