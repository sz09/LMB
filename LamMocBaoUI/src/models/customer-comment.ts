import { BaseModel } from "./base.model";
import { UploadedImage } from "./uploaded-image";

export class CustomerComment extends BaseModel {
  public Hint!: string;
  public UploadedImageId !: string;
  public SequenceNumber!: number;
  public UploadedImage!: UploadedImage;
}
