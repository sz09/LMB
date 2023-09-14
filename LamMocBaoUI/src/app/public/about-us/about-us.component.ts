import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MetaKeyValue, MetaKeyWords } from '../../../services/external-data';
import { HomeService } from '../../../services/home-page.service';

@Component({
  selector: 'about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  _content: string | null = null;
  constructor(private sanitized: DomSanitizer,
    private _homeService: HomeService,
    private _titleService: Title,
    private meta: Meta,
    private _translate: TranslateService) {

  }
  ngOnInit(): void {
    this._homeService.loadAboutUs().subscribe(d => {
      this._content = d;
    })
    this._translate.get('Label.About_Us').subscribe(d => {
      this._titleService.setTitle(d)
      this.meta.addTag({ name: MetaKeyWords.keywords, content: d, charset: MetaKeyValue.charset });
      this.meta.addTag({ name: MetaKeyWords.description, content: d, charset: MetaKeyValue.charset });
    })
  }
  get content() {
    return this._content ? this.sanitized.bypassSecurityTrustHtml(this._content) : '';
  }
}
