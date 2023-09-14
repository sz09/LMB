import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { MessageService } from '../events/message.service';
import { CommonMessage } from '../events/messages/common';
import { MessageType } from '../events/messages/message-type';
import { CategoryGroup, LiteMaterial } from '../models/category';
import { CartItem } from '../models/common/cart-item';
import { Keys, SupportHomePageDirectFilter } from '../models/common/const';
import { ProductCart } from '../models/product-cart';
import { AuthService, User } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { isMobile } from '../services/extentions';
import { ContactInfo, getContactInfo, setContactInfo, setProductConfig } from '../services/external-data';
import { ProductService } from '../services/product.service';
import { SystemSettingService } from '../services/system-setting.service';
import { PaymentPolicyComponent } from './public/payment-policy/payment-policy.component';
import { ShippingPolicyComponent } from './public/shipping-policy/shipping-policy.component';
import { ShoppingGuideDetailsComponent } from './public/shopping-guide-details/shopping-guide-details.component';
import { WarrantyAndReturnsComponent } from './public/warranty-and-returns/warranty-and-returns.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  adminLargeMenu: boolean = true;
  searchTerm: string = '';
  materials: LiteMaterial[] = [];
  get isLoadingDone() {
    return Object.values(this.loadingStages).every(d => d == true);
  }
  contactInfo: ContactInfo = new ContactInfo();
  countCarts!: number
  updateCountCarts() {
    let countCarts = 0;
    this.productCarts.forEach(d => countCarts += d.Quantity);
    this.countCarts = countCarts;
  }
  googleMapUrl!: SafeResourceUrl;
  categoryGroup = CategoryGroup;
  loadingStages: {
    getContactInfos: boolean,

  } = {
      getContactInfos: false
    };
  azureFileStorage: string = environment.azureFileStorage;
  productCarts: CartItem[] = [];
  _timeoutLoadingPrepare = 500;
  readonly Timeout_After_Route: number = 300
  isMobile: boolean = isMobile();
  resizeTimeout = 100;
  resizeTimeoutId: any;
  isPublic: boolean = true;
  config: MatDialogConfig = {
     panelClass: "dialog-policy-responsive"
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      this.isMobile = isMobile();
    }, this.resizeTimeout)
  }

  constructor(private _systemSettingService: SystemSettingService,
    private _productService: ProductService,
    private _messageService: MessageService,
    private _categoryService: CategoryService,
    private _router: Router,
    private _authService: AuthService,
    private _sanitizer: DomSanitizer,
    private _translate: TranslateService,
    public dialog: MatDialog) {
    console.log(_router.config)

  }

  ngOnDestroy(): void {
    this._messageService.onDispose();
  }
  ngOnInit(): void {
    this.registerLoggedIn();
    this._systemSettingService.getContactInfos().subscribe(d => {
      setContactInfo(d);
      this.contactInfo = getContactInfo();
      setTimeout(() => {
        this.loadingStages.getContactInfos = true;
      }, this._timeoutLoadingPrepare);

      this.googleMapUrl = this._sanitizer.bypassSecurityTrustResourceUrl(d.GoogleMapFrameUrl)
    });

    this._productService.getConfig().subscribe(d => {
      setProductConfig(d);
    });
    var productCarts = localStorage.getItem(Keys.Product_Carts.toLowerCase());
    if (productCarts) {
      this.productCarts = JSON.parse(productCarts) as CartItem[];
      this.updateCountCarts();
    }
    this.registerCartChanging();

    this._categoryService.getByMaterials().subscribe(categories => {
      this.materials = categories.filter(d => SupportHomePageDirectFilter.ByMaterial.indexOf(d.LinkName) > -1)
        .sort((a, b) => SupportHomePageDirectFilter.ByMaterial.indexOf(a.LinkName) - SupportHomePageDirectFilter.ByMaterial.indexOf(b.LinkName));
    });
    setTimeout(() => {
      this.isPublic = this._router.url.indexOf('admin') === -1;
    })
    this.getMenuSize();
  }

  getMenuSize() {
    var key = 'adminMenuSizeLarge';
    var value = localStorage.getItem(key);
    if (value) {
      this.adminLargeMenu = value === 'true';
    }
    else {
      localStorage.setItem(key, 'true');
      this.adminLargeMenu = true;
    }
  }

  changeMenuSize(event: any) {
    this.adminLargeMenu = event;
    localStorage.setItem('adminMenuSizeLarge', event.toString());
  }
  registerCartChanging() {
    this._messageService.reigister(MessageType.ArtToCart, (cartItem: CartItem) => {
      var existingIndex = this.productCarts.findIndex(d => d.ProductId == cartItem.ProductId && d.ProductSizeId == cartItem.ProductSizeId);
      if (existingIndex > -1) {
        this.productCarts[existingIndex].Quantity += cartItem.Quantity;
      }
      else {
        this.productCarts.push(cartItem);
      }
      localStorage.setItem(Keys.Product_Carts.toLowerCase(), JSON.stringify(this.productCarts));
      this.updateCountCarts();
    });

    this._messageService.reigister(MessageType.UpdateCart, (productCarts: ProductCart[]) => {
      this.productCarts = productCarts.map(d => new CartItem(d.Id, d.SizeId, d.Quantity));
      this.updateCountCarts();
      localStorage.setItem(Keys.Product_Carts.toLowerCase(), JSON.stringify(this.productCarts));
    });
  }


  getImageUrl(fileUrl: string) {
    return this.azureFileStorage + '/' + fileUrl;
  }

  onProductSearchChange(event: any) {
    var timeout = 0;
    if (!this._router.url.endsWith(this.Product_Url)) {
      this._router.navigateByUrl(this.Product_Url);
      timeout = this.Timeout_After_Route;
    }
    setTimeout(() => {
      this._messageService.sendMessage(new CommonMessage(MessageType.SearchProduct, event.target.value));
    });
  }

  navigateToProductByGroup(categoryGroup: CategoryGroup) {
    this.doNavigateToProduct({ Group: categoryGroup });
  }

  navigateToProductByMaterial(id: string) {
    this.doNavigateToProduct({ CategoryId: id });
  }

  readonly Product_Url: string = 'vat-pham';
  doNavigateToProduct(data: any) {
    var timeout = 0;
    if (!this._router.url.endsWith(this.Product_Url)) {
      this._router.navigateByUrl(this.Product_Url);
      timeout = this.Timeout_After_Route;
    }
    setTimeout(() => {
      this._messageService.sendMessage(new CommonMessage(MessageType.OneTime, data));
    }, timeout)
  }

  userName!: string;
  registerLoggedIn() {
    var userJson = localStorage.getItem('c_user');
    if (userJson) {
      var user = JSON.parse(userJson) as User;
      this.userName = user.Username;
    }
    this._messageService.reigister(MessageType.Auth, (userName: string) => {
      this.userName = userName;
    });
  }
  doLogOff() {
    this._authService.logout();
  }

  openDialogShoppingGuide() {
    const dialogRef = this.dialog.open(ShoppingGuideDetailsComponent, this.config);
  }

  openDialogWarrantyAndReturns() {
    const dialogRef = this.dialog.open(WarrantyAndReturnsComponent, this.config);
  }

  openDialogShippingPolicy() {
    const dialogRef = this.dialog.open(ShippingPolicyComponent, this.config);
  }

  openDialogPaymentPolicy() {
    const dialogRef = this.dialog.open(PaymentPolicyComponent, this.config);
  }
}
