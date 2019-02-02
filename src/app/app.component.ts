import { Component } from '@angular/core';
import { StopwatchService } from './stopwatch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'workout-timer';
  stopwatchState$ = this.service.stopwatchState$();

  constructor(public service: StopwatchService) {
  }
}
