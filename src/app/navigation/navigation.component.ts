import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @ViewChild('drawer', { static: true })
  drawer!: MatSidenav;

  isConnected: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private overlay: OverlayContainer, private router: Router, private auth: AuthService) {
    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => this.drawer.close());
  }

  themeToggleControl = new FormControl(false);
  @HostBinding('class') className = '';

  ngOnInit(): void {
    this.themeToggleControl.valueChanges.subscribe((lightTheme) => {
      const lightClassName = 'lightTheme';
      this.className = lightTheme ? lightClassName : '';
      if (lightTheme) {
        this.overlay.getContainerElement().classList.add(lightClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(lightClassName);
      }
    });
    this.TestConnection();
    var interval = setInterval(() => this.TestConnection(), 3000); // Set Timer for checking connectivity every 3s.
  }

  getUrl(): string {
    return this.router.url;
  }

  getUserInfo(): string {
    // TODO: get user information
    return "Username (Identity)";
  }

  TestConnection(): void {
    this.auth.checkConnection().subscribe(res => {
      if(res.status == 200){
        this.isConnected = true
      }
      else{
        this.isConnected = false
      }
    });
  }
}