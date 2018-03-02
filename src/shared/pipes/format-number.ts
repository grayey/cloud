
import { Pipe, PipeTransform } from '@angular/core';
import * as utils from '../../utils/util';
@Pipe({
    name: 'formatNumber'
})

export class FormatNumberPipe implements PipeTransform {
    transform(value: string, args?: any) {
        //  console.log('value=', value);
        return utils.formatStringNumber(value, 2);
    }
}
