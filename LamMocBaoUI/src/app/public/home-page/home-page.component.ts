import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { MessageService } from '../../../events/message.service';
import { CommonMessage } from '../../../events/messages/common';
import { MessageType } from '../../../events/messages/message-type';
import { CategoryGroup } from '../../../models/category';
import { HomePageData, HompageContent } from '../../../models/homepage.model';
import { setProductDropdownProductTypes } from '../../../services/external-data';
import { HomeService } from '../../../services/home-page.service';
import { ViewScrollerService } from '../../../services/view-scroller.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  constructor(private _homeService: HomeService,
    private _titleService: Title,
    private _router: Router,
    private _translate: TranslateService,
    private _viewScrollerService: ViewScrollerService,
    private meta: Meta,
    private _messageService: MessageService) { }
  homePageData!: HomePageData;
  hompageContent!: HompageContent;
  azureFileStorage: string = environment.azureFileStorage;
  categoryGroup = CategoryGroup;
  ngOnInit() {
    this._homeService
      .getHomePageConfig()
      .subscribe(d => {
        this.homePageData = d;
        setProductDropdownProductTypes(d.ProductTypes);
      });
    this._homeService
      .getHomePageContent()
      .subscribe(d => this.hompageContent = d);
    this._translate.get('Title.HomePage').subscribe(d => this._titleService.setTitle(d));

    this.meta.addTags([
      { name: 'description', content: 'Lâm Mộc Bảo - Chuyên gia thiết kế vật phẩm phong thủy, vật phẩm theo ngũ hành.' },
      { name: 'author', content: 'Lâm Mộc Bảo' },
      { name: 'keywords', content: 'Lâm Mộc Bảo, Ngọc, Charm, Vật phẩm, Phong thủy, San hô, Aquamarine' },
    ])
  }
  ngAfterViewInit(): void {
    this._viewScrollerService.doScrollIfNeed();
  }

  getImageUrl(fileUrl: string) {
    return this.azureFileStorage + '/' + fileUrl;
  }

  navigateToProductByElement(id: string) {
    this.doNavigateToProduct({ ProductTypeId: id });
  }

  navigateToProductByCategory(id: string) {
    this.doNavigateToProduct({ CategoryId: id });
  }

  readonly Product_Url: string = 'vat-pham';
  readonly Timeout_After_Route: number = 100
  doNavigateToProduct(data: any) {
    var timeout = 0;
    if (!this._router.url.endsWith(this.Product_Url)) {
      this._router.navigateByUrl(this.Product_Url);
      timeout = this.Timeout_After_Route;
    }
    setTimeout(() => {
      this._messageService.sendMessage(new CommonMessage(MessageType.OneTime, data));
      this._messageService.sendMessage(new CommonMessage(MessageType.Navigated, timeout !== 0));
    }, timeout)
  }
}
