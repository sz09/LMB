import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import { LiteMaterial, SubCategory1 } from "../models/category";
import { SelectListItem } from "../models/common/SelectListItem";
import { CountProducts } from "../models/product";
import { ProductType } from "../models/product-type";
import { Tag } from "../models/tag";

export class ContactInfo {
  ContactAddress!: string
  ContactPhoneNumbers!: string;
  ContactPhoneNumberArr!: string[]
  Email!: string
  WorkingTime!: string
  GoogleMapFrameUrl!: string
  Facebook!: string
  FacebookName!: string
  Youtube!: string
  Instagram!: string
  ZaloPhone!: string
  Messenger!: string
  PrimaryPhone!: string
}

const _contactInfo: ContactInfo = new ContactInfo();
export function setContactInfo(ci: ContactInfo) {
  _contactInfo.ContactAddress = ci.ContactAddress;
  _contactInfo.ContactPhoneNumberArr = ci.ContactPhoneNumbers ? ci.ContactPhoneNumbers.split('-').map(d => d.trim()) : [];
  _contactInfo.ContactPhoneNumbers = ci.ContactPhoneNumbers;
  _contactInfo.Email = ci.Email;
  _contactInfo.WorkingTime = ci.WorkingTime;
  _contactInfo.GoogleMapFrameUrl = ci.GoogleMapFrameUrl;
  _contactInfo.Facebook = ci.Facebook;
  _contactInfo.FacebookName = ci.FacebookName;
  _contactInfo.Youtube = ci.Youtube;
  _contactInfo.Instagram = ci.Instagram;
  _contactInfo.ZaloPhone = ci.ZaloPhone;
  _contactInfo.Messenger = ci.Messenger;
  _contactInfo.PrimaryPhone = ci.PrimaryPhone;
}

export function getContactInfo() {
  return _contactInfo;
}

export class ProductConfig {
  FilterProductStep!: number;
  FilterProductPriceUpTo!: number;
  NumerDisplayProducts!: number;
}

const _productConfig: ProductConfig = new ProductConfig();
export function setProductConfig(productConfig: ProductConfig) {
  _productConfig.FilterProductStep = productConfig.FilterProductStep;
  _productConfig.FilterProductPriceUpTo = productConfig.FilterProductPriceUpTo;
  _productConfig.NumerDisplayProducts = productConfig.NumerDisplayProducts;
}

export function getProductConfig() {
  return _productConfig;
}
export class MenuHierarchy {
  MenuByProductTypes: MenuByProductType[] = [];
  MenuByCategories: any | MenuByCategoryGroup[] = [];
  Tags: Tag[] = [];
  IsSet: boolean = false;
}

export class MenuByProductType {
  Id!: string;
  Name!: string;
  LinkName!: string;
  TypeTags!: ProductTypeTag[];

}
export class MenuByCategoryGroup {
  constructor(key: CategoryGroup, categories: MenuByCategory[]) {
    this.Key = key;
    this.Categories = categories;
  }
  Key!: CategoryGroup;
  Categories!: MenuByCategory[];
}
export enum CategoryGroup {
  VatPhamTheoNguHanh = 0,
  VatPhamTheoChatLieu = 1,
  VatPhamSuuTam = 2,
  Nhan = 3,
  VongCo = 4,
  TuongPhat = 5,
  LinhThu = 6,
  TreoXe = 7,
  XongTram = 8,
  CharmVang24K = 9
}

export function getCategoryGroupDescription(value: CategoryGroup) {
  switch (value) {
    case CategoryGroup.VatPhamTheoNguHanh:
      return 'Vật phẩm theo ngũ hành';
    case CategoryGroup.VatPhamTheoChatLieu:
      return 'Vật phẩm theo chất liệu';
    case CategoryGroup.VatPhamSuuTam:
      return 'Vật phẩm sưu tầm';
    case CategoryGroup.Nhan:
      return 'Nhẫn';
    case CategoryGroup.VongCo:
      return 'Vòng cổ';
    case CategoryGroup.TuongPhat:
      return 'Tượng Phật';
    case CategoryGroup.LinhThu:
      return 'Linh thú';
    case CategoryGroup.TreoXe:
      return 'Treo xe';
    case CategoryGroup.XongTram:
      return 'Xông trầm';
    default:
      return 'Charm vàng 24K';
  }
}
export class ProductTypeTag {
  Id!: string;
  Name!: string;
}

export class MenuByCategory {
  Id!: string;
  Name!: string;
  IsShowOnFilter!: boolean;
  ShowOnFilter!: boolean;
  SubCategories!: SubCategory1[]
}

export class PaymentInfos {
  BankAccount !: string;
 CardHolderName!: string;
 BankName!: string;
}


export enum MetaKeyWords {
  keywords = 'keywords',
  description = 'description'
}

export enum MetaKeyValue {
  charset = 'UTF-8',
}
const _categories: SelectListItem[] = [];
export function setProductDropdownCategories(categories: SelectListItem[]) {
  for (var i = 0; i < _categories.length; i++) {
    _categories.pop();
  }
  categories.forEach(d => {
    _categories.push(d);
  });
}

export function getProductDropdownCategories() {
  return _categories;
}

const _productTypes: ProductType[] = [];
export function setProductDropdownProductTypes(productTypes: ProductType[]) {
  for (var i = 0; i < _productTypes.length; i++) {
    _productTypes.pop()
  }
  productTypes.forEach(d => {
    _productTypes.push(d);
  });
}

export function getProductDropdownProductTypes() {
  return _productTypes;
}

const _liteMaterials: LiteMaterial[] = [];
export function setProductDropdownLiteMaterials(liteMaterials: LiteMaterial[]) {
  for (var i = 0; i < _liteMaterials.length; i++) {
    _liteMaterials.pop()
  }
  liteMaterials.forEach(d => {
    _liteMaterials.push(d);
  });
}

export function getProductDropdownLiteMaterials() {
  return _liteMaterials;
}

const _countProducts: any = {};
export function setCountProducts(countProducts: CountProducts[]) {
  if (Object.keys(_countProducts).length) {
    return;
  }
  countProducts.forEach(r => {
    _countProducts[r.TypeId] = r.Count;
  })
}

export function getCountProducts() {
  return _countProducts;
}

const _productMenu: MenuHierarchy = new MenuHierarchy;
export function setProductFilterMenu(productMenu: MenuHierarchy) {
  if (_productMenu.IsSet) {
    return;
  }

  _productMenu.MenuByCategories = productMenu.MenuByCategories;
  _productMenu.MenuByProductTypes = productMenu.MenuByProductTypes;
  _productMenu.Tags = productMenu.Tags;
  _productMenu.IsSet = true;
}

export function getProductFilterMenu() {
  return _productMenu;
}

