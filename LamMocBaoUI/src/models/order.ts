import { BaseModel } from "./base.model";

export enum CartStatus {
  OnCart,
  OnPayment,
  Complete
}

export class OrderModel {
  Id!: string;
  Address: AddressModel = new AddressModel();
  Customer: CustomerModel = new CustomerModel();
  DeliveryAddress: DeliveryAddressModel = new DeliveryAddressModel();
  Note!: string;
  PromotionCode!: string;
  IsDeliveryToAnotherAddress!: boolean;
  PaymentType!: PaymentMethod;
}

export class CustomerModel {
  Email!: string;
  FullName!: string;
  PhoneNumber!: string;
  BirthDay?: Date;
  Birthday?: Date;
  BirthDayDate!: string;
  BirthDayTime!: string;
  BirthDayType: DayType = DayType.SolarCalendar;
}

export class AddressModel {
  ProvinceId: string = '';
  Province: string = '';
  DistrictId: string = '';
  District: string = '';
  WardId: string = '';
  Ward: string = '';
  NumberAndStreet!: string;
}

export class DeliveryAddressModel {
  OrderId!: string;
  ProvinceId: string = '';
  Province: string = '';
  DistrictId: string = '';
  District: string = '';
  WardId: string = '';
  Ward: string = '';
  Address!: string;
  PhoneNumber!: string;
  Receiver!: string;
}

export enum PaymentMethod {
  COD = 1,
  BankTranfer = 2
}

export enum DayType {
  SolarCalendar = 1,
  LunarCalendar = 2
}

export class LiteOrderModel extends BaseModel {
  Address!: string;
  District!: string;
  Email!: string;
  PhoneNumber!: string;
  Province!: string;
  Ward!: string;
  FullName!: string;
}


export class OrderDetailModel {
  Id!: string;
  Customer: CustomerModel = new CustomerModel();
  DeliveryAddress: DeliveryAddressModel = new DeliveryAddressModel();
  Note!: string;
  PromotionCode!: string;
  PromotionMessage!: string;
  CalculatedPrice!: number;
  IsDeliveryToAnotherAddress!: boolean;
  PaymentType!: PaymentMethod;
  OrderStatus!: OrderStatus;
  OrderDetails!: OrderDetailItem[];
  Address!: string;
  Ward!: string;
  District!: string;
  Province!: string;
}

export class OrderDetailItem {
  Id!: string;
  PreviewImage!: string;
  Name !: string;
  Price!: number;
  Quantity!: number;
  SizeId!: string;
  SizeName!: string;
}


export enum OrderStatus {
  Ordered = 0,
  Paid = 1,
  Prepared = 2,
  Delivering = 3,
  Delivered = 4,
  Cancelled = 5,
  ReturnedBack = 6,
  Done = 999
}
