
import { Model, Types } from "mongoose";
import User, { UserModel } from "../../../mongoose/models/Users";
import { MockBase } from "../../core/MockBase";
import { mockUserTemplate } from "./userTemplate";
import { range } from "lodash";
import { generateTokens } from "../../../helpers/auth/jwt";
import { ITokens } from "../../../mongoose/models/Tokens";
import { v4 as uuid } from "uuid";
import { assert } from "../../../helpers/asserts";
import { passwordManager } from "../../../helpers/auth/password";
interface IUserMock extends UserModel {
  tokens?: ITokens;
  dummyKey?: string;
}
export class UserMock extends MockBase<IUserMock> {
  protected data: IUserMock[];
  protected model: Model<IUserMock>;
  protected template: () => IUserMock | Partial<IUserMock>;
  constructor(
    template: () => IUserMock | Partial<IUserMock>,
    model: Model<IUserMock>,
  ) {
    super(template, model);
    this.model = model;
    this.template = template;
    this.data = [];
  }
  protected createTemplate(
    fieldsToOverride?: Partial<IUserMock>,
  ): IUserMock | Partial<IUserMock> {
    return { ...this.template(), ...fieldsToOverride };
  }

  async create(
    fieldsToOverride?: Partial<IUserMock>,
  ): Promise<IUserMock | null> {
    const overrideFields = this.createTemplate(fieldsToOverride);

    const user = new this.model(overrideFields);
    await user.save();
    
    const tokens = await generateTokens(user.toObject());
    const newUser = {
      ...user.toObject(),
      dummyKey: overrideFields.dummyKey ?? uuid(),
      tokens,
    };
    this.data.push(newUser);
    return newUser;
  }

  async createMany(
    totalDocumentToCreate = 3,
    fieldsToOverride?: IUserMock,
  ): Promise<IUserMock[] | null> {
    const totalNumbersToArray = range(0, totalDocumentToCreate);
    for (let i = 0; i < totalNumbersToArray.length; i++) {
      const overrideFields = this.createTemplate(fieldsToOverride);
      const user = new this.model(overrideFields);
      await user.save();
      const tokens = await generateTokens(user.toObject());
      const newUser = {
        ...user.toObject(),
        dummyKey: overrideFields.dummyKey ?? uuid(),
        tokens,
      };
      this.data.push(newUser);
    }
    return this.data;
  }
  async deleteOne(id: Types.ObjectId): Promise<null> {
    const newData = this.data.filter((data: IUserMock) => data.id !== id);
    this.data = newData;
    return null;
  }

  getToken(id: string) {
    const dataToExtraToken = this.data.find(
      (user: IUserMock) => user.dummyKey === id || user.email === id,
    );
    return dataToExtraToken.tokens.accessToken;
  }
  getId(id: string): string {
    const user = this.data.find((_user: IUserMock) => _user.dummyKey === id);
    return user.id.toString();
  }
}

export const mockUser = new UserMock(mockUserTemplate, User);
