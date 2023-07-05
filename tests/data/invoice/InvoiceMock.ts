
import { Model, Types } from "mongoose";
import { MockBase } from "../../core/MockBase";
import { mockInvoiceTemplate } from "./invoiceTemplate";
import { range } from "lodash";
import { v4 as uuid } from "uuid";
import { Invoice, InvoiceModel } from "../../../database/models/Invoice";

interface IInvoiceMock extends Invoice {
  dummyKey?: string;
}
export class InvoiceMock extends MockBase<IInvoiceMock> {
  protected data: IInvoiceMock[];
  protected model: Model<IInvoiceMock>;
  protected template: () => IInvoiceMock | Partial<IInvoiceMock>;
  constructor(
    template: () => IInvoiceMock | Partial<IInvoiceMock>,
    model: Model<IInvoiceMock>,
  ) {
    super(template, model);
    this.model = model;
    this.template = template;
    this.data = [];
  }
  protected createTemplate(
    fieldsToOverride?: Partial<IInvoiceMock>,
  ): IInvoiceMock | Partial<IInvoiceMock> {
    return { ...this.template(), ...fieldsToOverride };
  }

  async create(
    fieldsToOverride?: Partial<IInvoiceMock>,
  ): Promise<IInvoiceMock | null> {
    const overrideFields = this.createTemplate(fieldsToOverride);

    const invoice = new this.model(overrideFields);
    await invoice.save();
    
    const newInvoice = {
      ...invoice.toObject(),
      dummyKey: overrideFields.dummyKey ?? uuid(),
    };
    this.data.push(newInvoice);
    return newInvoice;
  }

  async createMany(
    totalDocumentToCreate = 3,
    fieldsToOverride?: IInvoiceMock,
  ): Promise<IInvoiceMock[] | null> {
    const totalNumbersToArray = range(0, totalDocumentToCreate);
    for (let i = 0; i < totalNumbersToArray.length; i++) {
      const overrideFields = this.createTemplate(fieldsToOverride);
      const invoice = new this.model(overrideFields);
      await invoice.save();
      const newInvoice = {
        ...invoice.toObject(),
        dummyKey: overrideFields.dummyKey ?? uuid(),
      };
      this.data.push(newInvoice);
    }
    return this.data;
  }
  async deleteOne(id: string): Promise<null> {
    const newData = this.data.filter((data: IInvoiceMock) => data._id !== id);
    this.data = newData;
    return null;
  }

  getId(id: string): string {
    const invoice = this.data.find((invoice: IInvoiceMock) => invoice.dummyKey === id);
    return invoice._id.toString();
  }
}

export const mockUser = new InvoiceMock(mockInvoiceTemplate, InvoiceModel);
