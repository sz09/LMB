import { formatDate } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { map, Observable } from "rxjs";
import { SelectListItem } from "../models/common/SelectListItem";

export function batch(items: any[], chunkSize: number) {
  if (!items) {
    return [];
  }
  var result: any[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

export const mobileWidth: number = 430;

export function useBatchSizeByScreen(forPC: number, forMobile: number) {
  return isMobile() ? forMobile : forPC;
}

export function isMobile() {
  try {
    if (window.screen) {
      return window.screen.width <= mobileWidth;
    }
    return false;

  } catch (e) {
    return false;
  }
}

export function format(source: string, ...params: string[]) {
  if (!source) {
    return '';
  }
  return source.replace(/{(\d+)}/g, function (match, number) {
    return typeof params[number] != 'undefined'
      ? params[number]
      : match
      ;
  });
}

export function appendNoneForDropdown(items: SelectListItem[], translate: TranslateService, useNull: boolean = false): Observable<SelectListItem[]> {
  var nullValue = useNull ? null : '';
  return translate.get('Common.PleaseSelectItem').pipe(map((d: string) => {
    if (items.findIndex(d => d.Id === nullValue) == -1) {
      var noneItem = new SelectListItem();
      noneItem.Id = nullValue;
      noneItem.Label = d;
      items.unshift(noneItem)
    }
    return items;
  }));
}
export const map1: any = {};
export function formatDateToLocale(date: any, useSeconds: boolean = false): string {
  var date1 = new Date(date);
  date1.setHours(date1.getHours() + 7);
  var format = useSeconds ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy HH:mm";
  const locale = 'vi-VN';
  return formatDate(date1, format, locale);
}
