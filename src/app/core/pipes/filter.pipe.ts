import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  // pure: false,
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string): any {
    if (value.length === 0 || filterString === '') {
      return value;
    }

    const resultArray = [];

    for (const item of value) {
      console.log(item);
      if ((item['firstName'].toLowerCase()).indexOf(filterString.toLowerCase()) !== -1 ||
          (item['lastName'].toLowerCase()).indexOf(filterString.toLowerCase()) !== -1) {
        resultArray.push(item);
      }
    }

    return resultArray;
  }
}
