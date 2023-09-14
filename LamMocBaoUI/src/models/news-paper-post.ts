import { BaseModel } from "./base.model";
import { UploadedImage } from "./uploaded-image";

export class NewsPaperPost extends BaseModel {

  public Hint!: string;
  public Link!: string;
  public UploadedImageId !: string;
  public SequenceNumber!: number;

  public UploadedImage!: UploadedImage;
}
