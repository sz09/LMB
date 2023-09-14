import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MessageService } from '../../../../events/message.service';
import { CommonMessage } from '../../../../events/messages/common';
import { MessageType } from '../../../../events/messages/message-type';
import { PublishedKnowledge } from '../../../../models/knowledge';
import { ProductLiteModel } from '../../../../models/product';
import { isMobile } from '../../../../services/extentions';
import { KnowledgeService } from '../../../../services/knowledge.service';

@Component({
  selector: 'list-link-knowledge',
  templateUrl: './list-link-knowledge.component.html',
  styleUrls: ['./list-link-knowledge.component.css']
})
export class ListLinkKnowledgeComponent implements OnInit {
  listKnowledges: PublishedKnowledge[] = [];
  knowledgesOnTrend: PublishedKnowledge[] = [];
  productsOnTrend: ProductLiteModel[] = [];
  searchTerm: string = '';
  @Input()
  selectedKnowledgeId!: string;
  isMobile: boolean = isMobile();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
    }, this.resizeTimeout)
  }

  resizeTimeout = 100;
  resizeTimeoutId: any;
  constructor(private _knowledgeService: KnowledgeService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    this._knowledgeService.searchTrend().subscribe(d => {
      this.listKnowledges = d.ListKnowledges;
      this.knowledgesOnTrend = d.KnowledgesOnTrend;
      this.productsOnTrend = d.ProductsOnTrend;
    })
  }

  onSearchKnowledge() {
    this._messageService.sendMessage(new CommonMessage(MessageType.SearchKnowledge, this.searchTerm));
  }
}
