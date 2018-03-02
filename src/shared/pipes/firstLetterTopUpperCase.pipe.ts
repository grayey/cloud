import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstLetterTopUpperCase'
})
export class FirstLetterTopUpperCase implements PipeTransform {
    transform(data: any, args?: any): any {
        if (!data) {
            return data;
        }
        const dataArray = (String(data) + ' ').split(' ');
        console.log('dataArray=', dataArray);
        let dataString = '';
        dataArray.forEach((val) => {
            if (val && val !== ' ') {
                dataString += (val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()) + ' ';
            }
        });
        return dataString;
    }

}
