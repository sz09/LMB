import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShowMode } from '../../../models/common/show-mode';
import { KnowledgeViewModel } from '../../../models/knowledge';
import { format, formatDateToLocale } from '../../../services/extentions';
import { HighlightEntityType, HighlightItemService } from '../../../services/highlight-Item.service';
import { KnowledgeService } from '../../../services/knowledge.service';
import { hideLoading, showLoading } from '../../../services/loader.service';

@Component({
  selector: 'knowledges-admin',
  templateUrl: './knowledges-admin.component.html',
  styleUrls: ['./knowledges-admin.component.css']
})
export class KnowledgesAdminComponent implements OnInit {
  mode: ShowMode = ShowMode.ShowGrid;
  showMode = ShowMode;
  columns: any[] = [];
  loadingIndicator: boolean = false;
  displayCheck: any;
  total: number = 0;
  totalRows: number = 0;
  rows: KnowledgeViewModel[] = [];
  get sorts(): {
    dir: string, prop: string
  }[] {
    var params = this.payload.OrderBy.split(' ');
    return [{ prop: params[0], dir: params[1] }]
  }
  payload: {
    Search: string,
    OrderBy: string,
    Page: number,
    PageSize: number,
    IncludeTotal: boolean
  } = {
      Search: '',
      OrderBy: 'ModifiedAt desc',
      Page: 0,
      PageSize: 10,
      IncludeTotal: true
    };

  keysToTranslate: string[] = [
    'Knowledge.Knowledge_Name',
    'Label.Knowledges',
    'Knowledge.EmptyData',
    'Knowledge.Knowledge_ModifiedAt',
    'Common.AreYouSureToDeleteItem'
  ];
  _translateTexts: any = {};
  gridMessage: { emptyMessage: string } = { emptyMessage: '' };
  /*  bsEditorModalRef!: BsModalRef;*/

  @ViewChild('actionTemplate')
  actionTemplate!: TemplateRef<any>;
  @ViewChild('modifiedAtTemplate')
  modifiedAtTemplate!: TemplateRef<any>;
  constructor(
    private _router: Router,
    private _knowledgeService: KnowledgeService,
    private _highlightItemService: HighlightItemService,
    private _translate: TranslateService) {
  }
  ngOnInit(): void {
    this.loadData();
    setTimeout(() => {
      this.loadColumn();
    });
  }

  formatDateToLocale = formatDateToLocale;

  loadData() {
    showLoading();
    this._knowledgeService.searchAdmin(this.payload).subscribe(d => {
      this.rows = d.Data;
      this.totalRows = d.Total;
      this.total = this.rows.length;
      this._highlightItemService.highlightItems(d.Data.map(d => d.Id), HighlightEntityType.Knowledges).subscribe(d => {
        this.highlightEntityIds = {};
        d.forEach(e => {
          this.highlightEntityIds[e] = true;
        })
      });
      hideLoading();
    })
  }

  loadColumn() {
    this._translate.get(this.keysToTranslate).subscribe(d => {
      Object.keys(d).forEach(key => {
        this._translateTexts[key] = d[key];
      });
      this.gridMessage.emptyMessage = this._translateTexts['Knowledge.EmptyData'];
      this.columns = [
        {
          minWidth: 200,
          prop: 'Name',
          name: this._translateTexts['Knowledge.Knowledge_Name'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          sortable: true
        },
        {
          minWidth: 200,
          prop: 'ModifiedAt',
          name: this._translateTexts['Knowledge.Knowledge_ModifiedAt'],
          headerClass: 'table-header-center',
          canAutoResize: true,
          isGeneral: true,
          sortable: true,
          cellTemplate: this.modifiedAtTemplate,
        },
        {
          width: 230,
          sortable: false,
          resizeable: false,
          canAutoResize: false,
          checkboxable: false,
          cellTemplate: this.actionTemplate,
          isGeneral: true,
          isFilterSortShow: true,
          isHomePageSortShow: true
        }
      ];
    });
  }
  create() {
    this.mode = ShowMode.Create;
  }

  onDelete(item: any) {
    if (confirm(format(this._translateTexts['Common.AreYouSureToDeleteItem'], this._translateTexts['Label.Knowledges'], `${item.Name}`))) {
      showLoading();
      this._knowledgeService.delete(item).subscribe(d => {
        this.loadData();
        hideLoading();
      })
    }
  }
  pageChange(pageNumber: number) {
    this.payload.Page = pageNumber;
    this.loadData();
  }
  onPublish(item: KnowledgeViewModel) {
    showLoading();
    this._knowledgeService.publish(item).subscribe(d => {
      hideLoading();
    })
  }
  onPreview(item: KnowledgeViewModel) {
    const url = this._router.serializeUrl(
      this._router.createUrlTree([`/kien-thuc/preview/${item.Id}`])
    );

    window.open(url, '_blank');
  }
  highlightEntityIds: any = {};
  highlightItem(item: KnowledgeViewModel) {
    showLoading();
    this._highlightItemService.doHighlightItem(item.Id, HighlightEntityType.Knowledges).subscribe(d => {
      hideLoading();
      this.highlightEntityIds[item.Id] = d.Data;
    })
  }
  onSort(event: any) {
    if (event.sorts.length) {
      var sorts = event.sorts as any[];
      this.payload.OrderBy = sorts.map(d => `${d.prop} ${d.dir}`).join(' ');
      this.pageChange(0);
    }
  }
}
