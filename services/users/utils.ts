import { userService } from ".";
import { AuthRequest } from "../../middleware";

export const canDeleteUser = async(req:AuthRequest, userId: string)=>{
    const result  = (await userService.findOne({ _id: userId, createdBy: req.user.id }))
    return !!result;
}