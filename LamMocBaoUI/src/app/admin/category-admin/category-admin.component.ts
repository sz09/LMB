import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { TranslateService } from '@ngx-translate/core';
import { Category, CategoryGroup } from '../../../models/category';
import { ShowMode } from '../../../models/common/show-mode';
import { CategoryService, DisplayMode } from '../../../services/category.service';
import { format } from '../../../services/extentions';
import { hideLoading, showLoading } from '../../../services/loader.service';

@Component({
  selector: 'category-admin',
  templateUrl: './category-admin.component.html',
  styleUrls: ['./category-admin.component.css']
})
export class CategoryAdminComponent implements OnInit {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  originalColumns: any[] = [];
  total: number = 0;
  originalRows: Category[] = [];
  rows: Category[] = [];
  payload: {
    Search: string,
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: 'Name asc',
      Page: 0,
      PageSize: 1000,
      IncludeTotal: true
    };
  changeModes: { Id: DisplayMode, Text: string }[] = [
    
  ];
  keysToTranslate: string[] = [
    'Category.Name',
    'Category.ShowOnFilter',
    'Category.ShowOnHomePage',
    'Category.ShowAll',
    'Category.Sorting',
    'Category.Group',
    'Common.AreYouSureToDeleteItem',
    'Label.Categories',
  ];
  selectedMode: DisplayMode = DisplayMode.ShowAll;
  displayMode = DisplayMode;
  displayCheck: any;
  loadingIndicator: boolean = false;

  @ViewChild('editTemplate')
  editTemplate!: TemplateRef<any>;
  @ViewChild('showOnFilterTemplate')
  showOnFilterTemplate!: TemplateRef<any>;
  @ViewChild('showOnHomePageTemplate')
  showOnHomePageTemplate!: TemplateRef<any>;
  @ViewChild('sortingTemplate')
  sortingTemplate!: TemplateRef<any>;
  @ViewChild('groupTemplate')
  groupTemplate!: TemplateRef<any>;

  constructor(private _categoryService: CategoryService,
    private _translate: TranslateService
  ) {

  }
  ngOnInit(): void {
    setTimeout(() => this.loadColumn());
    this.loadData();
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });
      this.changeModes = [
        { Id: DisplayMode.ShowAll, Text: this._translateTexts['Category.ShowAll'] },
        { Id: DisplayMode.ChangePositionHomepage, Text: this._translateTexts['Category.ShowOnHomePage'] },
        { Id: DisplayMode.ChangePositionFilter, Text: this._translateTexts['Category.ShowOnFilter'] },
      ];
    })
  }
  _translateTexts: any = {};
  loadColumn() {
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });

      this.originalColumns = [
        {
          prop: 'Group',
          minWidth: 150,
          name: this._translateTexts['Category.Group'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isFilterSortShow: true,
          cellTemplate: this.groupTemplate
        },
        {
          prop: 'Name',
          minWidth: 150,
          name: this._translateTexts['Category.Name'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        },
        {
          prop: 'ShowOnFilter',
          isCheckbox: true,
          minWidth: 150,
          name: this._translateTexts['Category.ShowOnFilter'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          cellTemplate: this.showOnFilterTemplate
        },
        {
          prop: 'ShowOnHomePage',
          minWidth:80,
          name: this._translateTexts['Category.ShowOnHomePage'],
          headerClass: 'table-header-center',
          canAutoResize: false,
          cellTemplate: this.showOnHomePageTemplate,
          isCheckbox: true
        },
        {
          minWidth: 100,
          headerClass: 'table-header-center',
          name: this._translateTexts['Category.Sorting'],
          canAutoResize: false,
          cellTemplate: this.sortingTemplate,
          isSorting: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        },
        {
          width: 100,
          sortable: false,
          resizeable: false,
          canAutoResize: false,
          checkboxable: false,
          cellTemplate: this.editTemplate,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        }
      ];
      this.columns = this.originalColumns.filter(d => d.isCheckbox || d.isGeneral);
    })
   
  }
  create() {
    this.mode = ShowMode.Create;
  }
  loadData() {
    showLoading();
    this._categoryService.searchAdmin(this.payload).subscribe(d => {
      this.originalRows = d.Data;
      this.rows = this.originalRows;
      this.displayGridChange();
      this.total = this.rows.length;
      hideLoading();
    })
  }

  displayGridChange() {
    switch (this.selectedMode) {
      case DisplayMode.ChangePositionFilter:
        var items = this.originalRows.filter(d => d.ShowOnFilter);
        var listShowFiller: Category[] = []
        Object.values(CategoryGroup).forEach(x => {
          var r = items.filter(d => d.Group == x);
          listShowFiller = listShowFiller.concat(r);
        })

        this.rows = listShowFiller.sort((a, b) => a.FilterSequenceNumber - b.FilterSequenceNumber);
        this.columns = this.originalColumns.filter(d => d.isFilterSortShow);
        break;
      case DisplayMode.ChangePositionHomepage:
        this.rows = this.originalRows.filter(d => d.ShowOnHomePage).sort((a, b) => a.HomePageSequenceNumber - b.HomePageSequenceNumber);
        this.columns = this.originalColumns.filter(d => d.isHomePageSortShow);
        break;
      default:
        this.rows = this.originalRows;
        this.columns = this.originalColumns.filter(d => d.isCheckbox || d.isGeneral);
        break;
    }
    this.total = this.rows.length;
  }

  onShowOnFilterChange(id: string) {
    var item = this.rows.find(d => d.Id == id);
    if (item) {
      this._categoryService.updateShowOnFilter(id, item.ShowOnFilter).subscribe(d => {
        this.loadData();
      })
    }
  }
  onShowOnHomePageChange(id: string) {
    var item = this.rows.find(d => d.Id == id);
    if (item) {
      showLoading();
      this._categoryService.updateShowOnHomePage(id, item.ShowOnHomePage).subscribe(d => {
        this.loadData();
        hideLoading();
      })
    }
  }

  moveUp(index: number) {
    this.swap(index, index - 1);
  }

  moveDown(index: number) {
    this.swap(index, index + 1);
  }

  swap(from: number, to: number) {
    var temp = {...this.rows[from]};
    this.rows[from] = this.rows[to];
    this.rows[to] = temp;
  }

  onSearch() {
    this.loadData();
  }

  saveSettings() {
    showLoading();
    var items = this.rows.map((d, i) => { return { Id: d.Id, Index: i + 1 } });
    this._categoryService.savePosition(items, this.selectedMode).subscribe(d => {
      this.loadData();
      hideLoading();
    })
  }

  isFirstOfGroup(group: CategoryGroup, id: string) {
    return this.rows.filter(d => d.Group == group).findIndex(d => d.Id == id) === 0;
  }
  
  isLastOfGroup(group: CategoryGroup, id: string) {
    var items = this.rows.filter(d => d.Group == group)
    return items.findIndex(d => d.Id == id) === items.length - 1;
  }

  getDisplayName(group: CategoryGroup) {
    return `Category.${CategoryGroup[group]}`;
  }
  readonly ShowOnHomePageLimit = 12;
  isLimitHomePageItems() {
    return this.rows.filter(d => d.ShowOnHomePage).length >= this.ShowOnHomePageLimit;
  }

  onDelete(item: Category) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Label.Categories'], item.Name))) {
      showLoading();
      this._categoryService.deleteCategory(item).subscribe(d => {
        this.loadData();
        hideLoading();
      })
    }
  }
}
