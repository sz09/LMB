import { BaseModel } from "./base.model";

export class Size extends BaseModel {
  Number!: number;
  Unit!: string;
}

export class ProductSize extends BaseModel {
  ProductId!: string;
  SizeId !: string;
  SellingPrice?: number;
}
