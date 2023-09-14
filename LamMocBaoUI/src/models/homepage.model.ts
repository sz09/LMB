import { NewsPaperPost } from "./news-paper-post";
import { BaseModel } from "./base.model";
import { Category } from "./category";
import { PublishedKnowledge } from "./knowledge";
import { ProductType } from "./product-type";
import { CustomerComment } from "./customer-comment";

export class HomePageData extends BaseModel {
  public Categories!: Category[];
  public NewsPaperPosts!: NewsPaperPost[];
  public CustomerComments!: CustomerComment[];
  public Knowledges!: PublishedKnowledge[];
  public ProductTypes!: ProductType[];
}

export class HompageContent {
  PersonalizedProductDesignContent!: string;
  AnalysisOfFateContent!: string;
  CollectRareItemsContent!: string;
}
