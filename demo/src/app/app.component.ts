import {Component} from '@angular/core';

import {finalize} from 'rxjs/operators';

import {SpeedTestService} from 'ng-speed-test';

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent {
  title = 'ng-speed-test-demo';

  public hasChecked:boolean = false;
  public hasError:boolean = false;
  public isChecking:boolean = false;
  public isTracking:boolean = false;
  public iterations:number = 1;
  public speeds:string[] = [];

  constructor(
    private speedTestService:SpeedTestService
  ) {

  }

  getSpeed():void {
    if (this.hasChecked) {
      this.speeds = [];

      this.hasChecked = false;
    }

    this.isChecking = true;

    this.speedTestService.getMbps(this.iterations).pipe(
      finalize(
        () => {
          this.isChecking = false;
        }
      )
    ).subscribe(
      (speed) => {
        this.hasError = speed === -1;

        if (!this.hasError) {
          this.speeds = [
            speed.toFixed(2)
          ];
        }

        this.hasChecked = true;
      }
    )
  }

  trackSpeed():void {
    if (this.hasChecked) {
      this.speeds = [];

      this.hasChecked = false;
    }

    this.isTracking = true;

    this.speedTestService.getMbps(1).subscribe(
      (speed) => {
        this.hasError = speed === -1;

        if (!this.hasError) {
          this.speeds.push(
            speed.toFixed(2)
          );

          if (this.speeds.length < this.iterations) {
            this.trackSpeed();
          } else {
            this.isTracking = false;
            this.hasChecked = true;
          }
        }
      }
    )
  }
}
