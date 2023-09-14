import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MessageService } from '../../../events/message.service';

@Component({
  selector: 'admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.css']
})
export class AdminNavigationComponent implements OnInit, AfterViewInit {
  selectedEntity?: EntityType;
  @Input()
  largeMenu: boolean = false;
  @Output()
  onMenuSizeChange = new EventEmitter<boolean>();
  menus: {
    RouterLink: string,
    Label: string,
    FontAwesomeCssClass: string,
    EntityType: EntityType,
  }[] = [
      {
        RouterLink: '/admin/san-pham',
        Label: 'Label.Products',
        FontAwesomeCssClass: 'fas fa-cubes',
        EntityType: EntityType.Products
      },
      {
        RouterLink: '/admin/don-hang',
        Label: 'Label.Orders',
        FontAwesomeCssClass: 'fas fa-shopping-cart',
        EntityType: EntityType.Orders
      },
      {
        RouterLink: '/admin/dat-lich',
        Label: 'Label.Appointments',
        FontAwesomeCssClass: 'fas fa-calendar-check',
        EntityType: EntityType.Apointment
      },
      {
        RouterLink: '/admin/ngu-hanh',
        Label: 'Label.ProductTypes',
        FontAwesomeCssClass: 'fas fa-star-of-david',
        EntityType: EntityType.ProductType
      },
      {
        RouterLink: '/admin/loai-san-pham',
        Label: 'Label.Categories',
        FontAwesomeCssClass: 'fa-solid fa-recycle',
        EntityType: EntityType.Categories
      },
      {
        RouterLink: '/admin/kich-co',
        Label: 'Label.Sizes',
        FontAwesomeCssClass: 'fas fa-circle-notch',
        EntityType: EntityType.Size
      },
      //{
      //  RouterLink: '/admin/chat-lieu',
      //  Label: 'Label.Materials',
      //  FontAwesomeCssClass: 'fa-solid fa-wand-magic-sparkles',
      //  EntityType: EntityType.Material
      //},
      {
        RouterLink: '/admin/tag',
        Label: 'Label.Tags',
        FontAwesomeCssClass: 'fas fa-tags',
        EntityType: EntityType.Tag
      },
      {
        RouterLink: '/admin/bao-chi',
        Label: 'Label.NewsPaperPosts',
        FontAwesomeCssClass: 'fas fa-newspaper',
        EntityType: EntityType.NewsPaperPosts
      },
      {
        RouterLink: '/admin/cam-nhan-khach-hang',
        Label: 'Label.CustomerComments',
        FontAwesomeCssClass: 'fas fa-comments',
        EntityType: EntityType.CustomerComment
      },
      {
        RouterLink: '/admin/kien-thuc',
        Label: 'Label.Knowledge',
        FontAwesomeCssClass: 'fas fa-book',
        EntityType: EntityType.Knowledges
      },
      {
        RouterLink: '/admin/khuyen-mai',
        Label: 'Label.Promotions',
        FontAwesomeCssClass: 'fas fa-percent',
        EntityType: EntityType.Promotion
      },
      {
        RouterLink: '/admin/ve-chung-toi',
        Label: 'Label.About_Us',
        FontAwesomeCssClass: 'fas fa-address-card',
        EntityType: EntityType.AboutUs
      },
      {
        RouterLink: '/admin/system-setting',
        Label: 'Label.SystemSettings',
        FontAwesomeCssClass: 'fas fa-cog',
        EntityType: EntityType.SystemSetting
      }
    ];

  constructor(private _router: Router, private _messageService: MessageService) {
  }
  ngOnInit(): void {
    this._router.events.subscribe(d => {
      var r = d as NavigationStart;
      if (r && r.url) {
        var existed = this.menus.find(d => r.url.indexOf(d.RouterLink) > -1);
        this.selectedEntity = existed?.EntityType ?? undefined;
      }
    });

    var existed = this.menus.find(d => this._router.url.indexOf(d.RouterLink) > -1);
    this.selectedEntity = existed?.EntityType ?? undefined;
  }
  ngAfterViewInit(): void {
    document.getElementsByTagName('body').item(0)?.classList.add('admin-layout');
    
  }

  toggleNavMenu() {
    this.largeMenu = !this.largeMenu;
    this.onMenuSizeChange.emit(this.largeMenu);
    setTimeout(() => { window.location.reload(); }, 200)
  }
}

export enum EntityType {
  Products,
  Orders,
  Apointment,
  FiveElements,
  ProductType,
  Categories,
  Size,
  Material,
  Tag,
  NewsPaperPosts,
  CustomerComment,
  Knowledges,
  Promotion,
  AboutUs,
  SystemSetting
}
