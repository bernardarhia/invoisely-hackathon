import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { selectRandomItem } from "../../../utils";
import { UserRole, userRoles } from "../../../interfaces/users";
import { UserModel } from "../../../mongoose/models/Users";

interface Country {
  country: string;
  code: string;
  iso: string;
}
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
    gender: selectRandomItem<"female" | "male">(["male", "female"]),
    physicalAddress: {
      zipCode: faker.address.zipCode(),
      houseNumber: faker.address.buildingNumber(),
      city: faker.address.city(),
      street: faker.address.street(),
      state: faker.address.state(),
    },
    mailingAddress: {
      zipCode: faker.address.zipCode(),
      houseNumber: faker.address.buildingNumber(),
      city: faker.address.city(),
      street: faker.address.street(),
      state: faker.address.state(),
    },
    belongsToOrg: false,
    organizationId: new mongoose.Types.ObjectId(),
    status: "active",
    deleted: false,
    isLoggedIn: true,
    dateOfBirth: new Date(),
    lastLoggedInDate: new Date(),
    createdBy: new mongoose.Types.ObjectId(),
    updatedBy: new mongoose.Types.ObjectId(),
  };
};
