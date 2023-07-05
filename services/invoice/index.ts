import { Model } from "mongoose";
import { BaseService } from "..";
import { Invoice, InvoiceModel } from "../../database/models/Invoice";

class InvoiceService extends BaseService<Invoice> {
  protected readonly model: Model<Invoice>;

  constructor(model: Model<Invoice>) {
    super(model);
  }
}
export const invoiceService = new InvoiceService(InvoiceModel);
