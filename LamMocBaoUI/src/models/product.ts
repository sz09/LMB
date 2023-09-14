import { Tag } from "./tag";
import { UploadedImage } from "./uploaded-image";

export class ProductDetail {
  Name!: string;
  LinkName!: string;
  Description!: string;
  SellingPrice: number = 0;
  PurchasingPrice: number = 0;
  IsRarely!: boolean;
  IsCollectibleItem!: boolean;
  ShortInfomations!: string;
  Infomations!: string;
  FormattedInfomations!: string;
  ProductFrom!: string;
  ProductTypeName!: string;
  CategoryId: string | null = '';
  Categories: any;
  ProductTypeId: string|null = '';
  ProductTypeTagIds!: string[];
  CategoryIds: string[] = [];
  TagIds: string[] = [];
  SizeIds: string[] = [];
  MaterialIds: string[] = [];
  bool!: boolean;
  Tags: Tag[] = [];
  Images: UploadedImage[] = [];
  RemoveImageIds: string[] = [];
  AddImageIds: string[] = [];
  Materials: MaterialViewModel[] = [];
  SupportedSizes: SizeViewModel[] = [];
  Id!: string;
  PriceBySizes: SizePriceModel[] = [];
}

export class Product {
  Id!: string;
  Name!: string;
  LinkName!: string;
  Description!: string;
  SellingPrice: number = 0;
  IsRarely!: boolean;
  ShortInfomations!: string;
  FormattedInfomations!: string;
  ProductFrom!: string;
  ProductTypeName!: string;
  bool!: boolean;
  Tags!: Tag[];

  Images!: UploadedImage[];
  Materials!: MaterialViewModel[];
  SupportedSizes!: SizeViewModel[];
  PriceBySizes!: SizePriceModel[];
}

export enum ProductOrder {
  MoiNhat = 'CreatedAt desc',
  BanChay = 'SoldNumberCount desc',
  GiaThapToiCao = 'SellingPrice asc',
  GiaCaoToiThap = 'SellingPrice desc'
}

export class SizeViewModel {
  Id!: string;
  SizeId!: string;
  Number!: number;
  Unit!: string;
  Label!: string;
  SellingPrice: number = 0;
}

export class MaterialViewModel {
  Id!: string;
  Name!: string;
  Description!: string;
}

export class SizePriceModel {
  SizeId!: string;
  SellingPrice?: number = 0;
}

export class ProductLiteModel {
  Name !: string;
  LinkName !: string;
  ImagePreview !: string;
  ShortDescription !: string;
  SellingPrice !: number;
}

export class SuggestionProduct{
  Id !: string;
  Name !: string;
  LinkName !: string;
  SellingPrice !: number;
  TagLabels!: string[];
  ProductImages!: string[];
}

export class CountProducts {
  TypeId!: string;
  CountBy!: CountBy
  Count!: number;
}

export enum CountBy {
  ProductType,
  Category
}

