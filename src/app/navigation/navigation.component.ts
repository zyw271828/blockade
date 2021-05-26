import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  themeToggleControl = new FormControl(false);
  @HostBinding('class') className = '';

  ngOnInit(): void {
    this.themeToggleControl.valueChanges.subscribe((lightTheme) => {
      const lightClassName = 'lightTheme';
      this.className = lightTheme ? lightClassName : '';
    });
  }
}
