import { isNumber } from "lodash";
import { InvoiceDiscountType, InvoiceItem } from "../../database/models/Invoice";
import { AuthRequest } from "../../middleware";
import { userService } from "../users";
import { invoiceService } from ".";


export const hasValidInvoiceItems = ({ }, invoiceItems: InvoiceItem[]) => {
    return invoiceItems && invoiceItems.length && invoiceItems.every((item: InvoiceItem) => {
        return item.price && isNumber(item.price)
            && item.product.length >= 3 &&
            item.description.length >= 3;
    })
}

export const hasValidInvoiceDiscount = ({ }, val: { amount: number, type: InvoiceDiscountType }) => {
    if (!val) return true;
    return val.amount && ["percentage", "number"].includes(val.type);
}

export const canAccessInvoice = async (req: AuthRequest, userId: string)=>{
    const result  = (await userService.findOne({ _id: userId, createdBy: req.user.id }))
    return !!result;
}

export const canDeleteInvoice = async(req:AuthRequest, invoiceId: string)=>{
    const result  = (await invoiceService.findOne({ _id: invoiceId, createdBy: req.user.id }))
    return !!result;
}