import { BaseModel } from "./base.model";
import { ProductLiteModel } from "./product";
import { UploadedImage } from "./uploaded-image";

export class PublishedKnowledge extends BaseModel {
  public OriginKnowledgeId!: string;
  public Name!: string;
  public NameWithoutUTF8!: string;
  public LinkName !: string;
  public Summary!: string;
  public Content !: string;
  public SequenceNumber !: number;
  public UploadedImageId !: string;
  public UploadedImage!: UploadedImage;
  public ModifiedAt!: Date;
  public CreatedAt!: Date;
  public PublishedTime!: Date;
}

export class KnowledgeViewModel {
  Id!: string;
  Name!: string;
  Content!: string;
  Summary!: string;
  ImagePreviews!: string[];
  TagIds: string[] = [];
  UploadedImageId!: string;
  UploadedImageUrl!: string;
  SequenceNumber!: number;
}

export class Trend {
  KnowledgesOnTrend: PublishedKnowledge[] = [];
  ListKnowledges: PublishedKnowledge[] = [];
  ProductsOnTrend: ProductLiteModel[] = [];
}
