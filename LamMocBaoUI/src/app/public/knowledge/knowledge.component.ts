import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../events/message.service';
import { MessageType } from '../../../events/messages/message-type';
import { PublishedKnowledge } from '../../../models/knowledge';
import { formatDateToLocale } from '../../../services/extentions';
import { MetaKeyValue, MetaKeyWords } from '../../../services/external-data';
import { KnowledgeService } from '../../../services/knowledge.service';

@Component({
  selector: 'knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.css']
})
export class KnowledgeComponent implements OnInit, OnDestroy {
  knowledges!: PublishedKnowledge[];
  constructor(private _knowledgeService: KnowledgeService,
    private _titleService: Title,
    private _translate: TranslateService,
    private _messageService: MessageService,
    private meta: Meta) { }
  payload: {
    Search: string,
    PageSize: number,
    Page: number,
    OrderBy: string,
  } = {
      Search: '',
      PageSize: 5,
      Page: 0,
      OrderBy: 'CreatedAt desc'
    };
  total: number = 0;
  timeOutScroll: any;
  ngOnInit(): void {
    this._translate.get('Label.Knowledge').subscribe(d => {
      this._titleService.setTitle(d)
      this.meta.addTag({ name: MetaKeyWords.keywords, content: d, charset: MetaKeyValue.charset });
      this.meta.addTag({ name: MetaKeyWords.description, content: d, charset: MetaKeyValue.charset });
    })
    this._messageService.reigister(MessageType.SearchKnowledge, (searchTerm: string) => {
      this.payload.Search = searchTerm;
      this.pageChange(0);
    });
    this.onSearchKnowledge();
    this.scrollToTop();

  }

  scrollToTop() {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }, 100)
  }
  ngOnDestroy(): void {
    this._messageService.unreigister(MessageType.SearchKnowledge);
  }

  getDisplayPublishTime(knowledge: PublishedKnowledge) {
    return formatDateToLocale(knowledge.PublishedTime);
  }
  _delay = 300;
  _timeout: any;
  onSearchKnowledge() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      this._knowledgeService.search(this.payload).subscribe(d => {
        this.knowledges = d.Data;
        this.total = d.Total;
      });
    }, this._delay);
  }

  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.onSearchKnowledge();
  }
}
