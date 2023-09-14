import { BaseModel } from "./base.model";

export class LiteMaterial extends BaseModel {

  public Name!: string;
  public LinkName!: string;
}

export class Category extends BaseModel {
  public Name!: string;
  public HomePageSequenceNumber!: number;
  public FilterSequenceNumber!: number;
  public LinkName!: string;
  public DisplayImageUrl!: string;
  public Description!: string;
  public ShowOnHomePage!: boolean;
  public ShowOnFilter !: boolean;
  public AssignableToProduct!: boolean;
  public Group: CategoryGroup = CategoryGroup.VatPhamTheoChatLieu;
  public OriginalType!: OriginalType;
  public SubCategories: SubCategory1[] = [];
}

export class SubCategory extends BaseModel {
  public TempId!: string;
  public Name!: string;
  public ParentId!: string;
  public SequenceNumber!: number;
  public IsRemoved: boolean = false;
  public IsAdded: boolean = false;
  public IsChecked: boolean = false;

  get checked() {
    return this.IsAdded || this.IsChecked;
  }
  set checked(checked: boolean) {
    if (!checked) {
      this.IsAdded = false;
      this.IsChecked = false;
      this.IsRemoved = true;
    }
    else {
      this.IsAdded = true;
      this.IsChecked = true;
      this.IsRemoved = false;
    }
  }
}

export class SubCategory1 extends SubCategory {
  constructor(obj: any) {
    super();
    if (obj) {
      this.Id = obj.Id;
      this.Name = obj.Name;
      this.ParentId = obj.ParentId;
      this.SequenceNumber = obj.SequenceNumber;
      this.IsRemoved = obj.IsRemoved;
      this.IsAdded = obj.IsAdded;
      this.IsChecked = obj.IsChecked;
      if (obj.SubCategories && obj.SubCategories.length) {
        obj.SubCategories.forEach((obj2: any) => {
          this.SubCategories.push(new SubCategory2(obj2));
        })
      }
    }
  }
  public SubCategories: SubCategory2[] = [];
}

export class SubCategory2 extends SubCategory {
  constructor(obj: any) {
    super();
    if (obj) {
      this.Id = obj.Id;
      this.Name = obj.Name;
      this.ParentId = obj.ParentId;
      this.SequenceNumber = obj.SequenceNumber;
      this.IsRemoved = obj.IsRemoved;
      this.IsAdded = obj.IsAdded;
      this.IsChecked = obj.IsChecked;
    }
  }
}

export enum OriginalType {
  TramHuong = 1,
  SanHo = 2,
  TuDan = 3,
  HuyetLong = 4
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
