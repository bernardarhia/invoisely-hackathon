import { isNumber } from "lodash";
import { InvoiceDiscountType, InvoiceItem } from "../../mongoose/models/Invoice";


const validateInvoiceItem = (item: InvoiceItem): boolean => {
    return item.price && isNumber(item.price)
        && item.product.length >= 3 &&
        item.description.length >= 3;
}
export const hasValidInvoiceItems = ({ }, invoiceItems: InvoiceItem[]) => {
    return invoiceItems.every((item: InvoiceItem) => {
        return validateInvoiceItem(item)
    })
}

export const hasValidInvoiceDiscount = ({ }, val: { amount: number, type: InvoiceDiscountType }) => {
    if (!val) return true;
    return val.amount && ["percentage", "number"].includes(val.type);
}