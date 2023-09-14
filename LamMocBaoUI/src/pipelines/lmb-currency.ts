import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
@Pipe({
  name: 'lmbcurrency',
})
export class LMBCurrencyPipe implements PipeTransform {
  transform(
    value?: number,
    currencyCode: string = 'VND',
    display:
      | 'code'
      | 'symbol'
      | 'symbol-narrow'
      | string
      | boolean = 'symbol',
    digitsInfo: string = '0.0-0',
    locale: string = 'vi-VN',
  ): string | null {
    if (typeof (value) === 'undefined' || value === null) {
      return '';
    }

    return formatCurrency(
      value,
      locale,
      getCurrencySymbol(currencyCode, 'wide'),
      currencyCode,
      digitsInfo,
    );
  }
}
