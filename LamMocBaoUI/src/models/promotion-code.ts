import { BaseModel } from "./base.model";

export class Promotion extends BaseModel {
  Code!: string;
  Content!: string;
  DiscountPercent!: number;
  IsActive!: string;
  PromotionMode!: PromotionMode;
  From?: Date;
  To?: Date;
}

export enum PromotionMode {
  Manual = 1,
  Period = 2
}
