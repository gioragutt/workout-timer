import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const seconds = value / 1000;
    const milliseconds = value % 1000;
    const minutes: number = Math.floor(seconds / 60);
    const millisecondsString = Math.floor(milliseconds / 10).toString().padStart(2, '0');
    const secondsString = Math.floor((seconds - minutes * 60)).toString().padStart(2, '0');
    return `${minutes}:${secondsString}.${millisecondsString}`;
  }

}
