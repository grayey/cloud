
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reminderFilter'
})

export class ReminderPipe implements PipeTransform {
    transform(value: Array<any>, args?: any) {
        // console.log('value=', value, 'arges=', args);
        return value.filter((val, key) => (val['key'] < +args[0]));
    }
}
