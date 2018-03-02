
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pluckOutSelected'
})

export class PluckOutSelectedPipe implements PipeTransform {
    transform(value: Array<any>, args: Object) {
        console.log('value=', value, 'arges=', args);
        if (!args['key']) {
            return value;
        }
        return value.filter((val, key) => (+val[args['key']] !== +args['value']));
    }
}
