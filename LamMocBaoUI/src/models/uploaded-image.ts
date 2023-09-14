import { BaseModel } from "./base.model";

export class UploadedImage extends BaseModel {

  public EntityId!: string | any;
  public Url!: string;
  public UrlPreview!: string;
}
