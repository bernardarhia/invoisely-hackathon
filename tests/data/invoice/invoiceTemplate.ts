import { faker } from "@faker-js/faker";
import { Invoice } from "../../../database/models/Invoice";
import { v4 as uuid } from "uuid";


export const mockInvoiceTemplate = (): Partial<Invoice> => {
  return {
    items: [
      {
          price: Number(faker.finance.amount()),
          product: faker.name.jobDescriptor(),
          description: faker.lorem.sentence(10),
          quantity: 2
      }
  ],
  userId: uuid()
  };
};
