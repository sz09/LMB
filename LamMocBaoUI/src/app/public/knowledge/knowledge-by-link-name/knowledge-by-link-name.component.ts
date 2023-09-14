import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { KnowledgeViewModel } from '../../../../models/knowledge';
import { isMobile } from '../../../../services/extentions';
import { MetaKeyValue, MetaKeyWords } from '../../../../services/external-data';
import { KnowledgeService } from '../../../../services/knowledge.service';

@Component({
  selector: 'knowledge-by-link-name',
  templateUrl: './knowledge-by-link-name.component.html',
  styleUrls: ['./knowledge-by-link-name.component.css']
})
export class KnowledgeByLinkNameComponent implements OnInit {
  knowledge!: KnowledgeViewModel;
  constructor(private _knowledgeService: KnowledgeService,
    private _router: Router,
    private _titleService: Title,
    private _meta: Meta,
    private _activatedRoute: ActivatedRoute, private sanitized: DomSanitizer) { }

  isMobile: boolean = isMobile();
  resizeTimeout = 100;
  resizeTimeoutId: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
    }, this.resizeTimeout)
  }
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(d => {
      if (d['linkName']) {
        this._knowledgeService.getByLinkName(d['linkName']).subscribe(d => {
          this.doSetKnowledge(d);
          this._titleService.setTitle(d.Name)
          this._meta.addTag({ name: MetaKeyWords.keywords, content: d.Name, charset: MetaKeyValue.charset })
          this._meta.addTag({ name: MetaKeyWords.description, content: d.Summary, charset: MetaKeyValue.charset })
        });
      }
      else if (d['id']) {
        this._knowledgeService.getPreview(d['id']).subscribe(d => {
         this.doSetKnowledge(d);
        });
      }
      
    });
  }

  get content() {
    return this.knowledge && this.knowledge.Content ? this.sanitized.bypassSecurityTrustHtml(this.knowledge.Content) : '';
  }

  doSetKnowledge(knowledge: KnowledgeViewModel) {
    if (knowledge && knowledge.Id) {
      this.knowledge = knowledge;
    }
    else {
      this._router.navigateByUrl('404');
    }
  }
}
