import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { selectRandomItem } from "../../../utils";
import { UserRole, userRoles } from "../../../interfaces/users";
import { UserModel } from "../../../database/models/Users";
import { v4 as uuid } from "uuid";

export const mockUserTemplate = (): Partial<UserModel> => {
  return {
    email: faker.internet.email(),
    phone: {
      prefix: "233",
      number: faker.phone.number(),
    },
    password: "TestPassword123!",
    role: selectRandomItem<UserRole>(userRoles),
    firstName: faker.internet.userName(),
    lastName: faker.internet.userName(),
    mailingAddress: {
      zipCode: faker.address.zipCode(),
      houseNumber: faker.address.buildingNumber(),
      city: faker.address.city(),
      street: faker.address.street(),
      state: faker.address.state(),
    },
    status: "active",
    deleted: false,
    createdBy: uuid(),
    updatedBy: uuid(),
  };
};
