import { BaseModel } from "./base.model";

export class SystemSetting extends BaseModel {
  PhoneNumber!: string;
  Email!: string;
  BankAccount!: string;
  CardHolderName!: string;
  BankName!: string;
  MomoPaymentQRImage!: string;
  MomoPaymentPhoneNumber!: string;
  MomoPaymentCardHolder!: string;

  ContactAddress!: string;
  ContactPhoneNumbers!: string;
  WorkingTime!: string;
  GoogleMapFrameUrl!: string;
  Facebook!: string;
  Youtube!: string;
  Instagram!: string;
  ZaloPhone!: string;
  Messenger!: string;
  PrimaryPhone!: string;

  HighlightItemsInDays!: number;
  NumberOfHighlightItems!: number;
  AboutUs!: string;
}

export class AboutUs extends BaseModel {
  AboutUs!: string;
}
