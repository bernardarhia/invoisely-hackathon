import { Invoice, InvoiceItem } from "../../models/Invoice";
import { reduce } from "lodash";

export const addInvoiceItems = async function (this: Invoice, next: any) {
  try {

    // add invoice items prices
    const totalInvoiceItemAmount = reduce(this.items, (sum: number, item: InvoiceItem) => sum + item.price, 0);

    let invoiceDiscountAmount: number = 0;
    if (this.discount && Object.keys(this.discount).length) {
      if (this.discount.type === "number") {
        invoiceDiscountAmount = this.discount.amount;
      }
      else if (this.discount.type === "percentage") {
        invoiceDiscountAmount = (this.discount.amount / 100) * totalInvoiceItemAmount;
      }
    }
    this.totalAmount = totalInvoiceItemAmount + invoiceDiscountAmount;
    return next();
  } catch (error) {
    next(error);
  }
};