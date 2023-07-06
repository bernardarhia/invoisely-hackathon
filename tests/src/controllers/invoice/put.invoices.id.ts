
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
chai.use(chaiAsPromise);
chai.use(chaiHttp);
chai.should();

describe("UPDATE INVOICE  PUT /api/invoices/create", function () {
    const dummyKey = uuid();
    const dummyKey2 = uuid();
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
    })

    for (const field of Object.keys(invoice)) {
        it(`should not create invoice without ${field}`, async function () {
            const res = await chai
                .request(app.app)
                .post("/api/invoices/create")
                .set({
                    Authorization: `Bearer ${mockUser.getToken(dummyKey)}`,
                })
                .send(omit(invoice, [field]));
            res.status.should.be.a("number").eql(httpCodes.BAD_REQUEST.code)
        });
    }
    it(`should create invoice without non required fields`, async function () {
        const res = await chai
            .request(app.app)
            .post("/api/invoices/create")
            .set({
                Authorization: `Bearer ${mockUser.getToken(dummyKey)}`,
            })
            .send({ ...invoice, userId: mockUser.getId(dummyKey2) });

        res.status.should.be.a("number").eql(201)
        res.body.should.have.property("success").eql(true)
        res.body.should.have.property("response").should.be.a("object")
        res.body.response.should.have.property("items")
        res.body.response.should.have.property("userId").eql(mockUser.getId(dummyKey2))
        res.body.response.should.have.property("createdBy").eql(mockUser.getId(dummyKey))
    });

    const discountTypes = {
        type: selectRandomItem(["percentage", "number"]),
        amount: Math.floor(Math.random() * 100)
    }
    it(`should create invoice with discount as ${discountTypes.type}`, async function () {
        const res = await chai
            .request(app.app)
            .post("/api/invoices/create")
            .set({
                Authorization: `Bearer ${mockUser.getToken(dummyKey)}`,
            })
            .send({
                ...invoice, userId: mockUser.getId(dummyKey2),
                discount: { type: discountTypes.type, amount: discountTypes.amount }
            });

        res.status.should.be.a("number").eql(201)
        res.body.should.have.property("success").eql(true)
        res.body.should.have.property("response").should.be.a("object")
        res.body.response.should.have.property("items")
        res.body.response.should.have.property("userId").eql(mockUser.getId(dummyKey2))
        res.body.response.should.have.property("createdBy").eql(mockUser.getId(dummyKey))
        res.body.response.should.have.property("discount").should.be.a("object")
        res.body.response.discount.should.have.property("type").be.a("string").eq( discountTypes.type)
        res.body.response.discount.should.have.property("amount").be.a("number").eql( discountTypes.amount)
    });
});
