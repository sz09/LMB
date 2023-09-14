import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CommonMessage } from "./messages/common";
import { MessageType } from "./messages/message-type";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  //private subject = new Subject<CommonMessage>();
  private tasksPublisher: any = {};
  constructor() { }

  reigister(messageType: MessageType, action: any) {
    var type = messageType.toString();
    if (this.tasksPublisher[type] === undefined) {
      var subject = new Subject<CommonMessage>()
      subject.subscribe(d => action(d.Data))
      this.tasksPublisher[type] = subject;
    }
  }

  unreigister(messageType: MessageType) {
    this.tasksPublisher[messageType.toString()] = undefined;
  }

  onDispose() {
    Object.values(this.tasksPublisher).forEach((d: any) => {
      d.unsubscribe && d.unsubscribe();
    })
  }
  sendMessage(message: CommonMessage) {
    var type = message.Type.toString();
    if (this.tasksPublisher[type]) {
      this.tasksPublisher[type].next(message);
    }
  }
}
