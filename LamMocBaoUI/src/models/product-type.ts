import { BaseModel } from "./base.model";

export class ProductType extends BaseModel {
  public Name!: string;
  public SequenceNumber!: number;
  public LinkName!: string;
  public DisplayImageUrl!: string;
  public Description!: string;
}
