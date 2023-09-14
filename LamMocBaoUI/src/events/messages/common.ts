import { MessageType } from "./message-type";

export class CommonMessage {
  constructor(type: MessageType, data: any) {
    this.Type = type;
    this.Data = data;
  }
  public Type!: MessageType;
  public Data: any;
}
