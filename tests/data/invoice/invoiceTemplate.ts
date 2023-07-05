import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { selectRandomItem } from "../../../utils";
import { Invoice } from "../../../database/models/Invoice";


export const mockInvoiceTemplate = (): Partial<Invoice> => {
  return {};
};
