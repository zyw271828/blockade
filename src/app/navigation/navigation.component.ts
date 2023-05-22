import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { IdentityService } from '../identity.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @ViewChild('drawer', { static: true })
  drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isConnected: boolean = false;
  userInfo: string = '未知（未知）';
  detailedUserInfo: string = '用户信息\n未知';
  userCanApprove: boolean = true;
  themeToggleControl = new FormControl(false);
  @HostBinding('class') className = '';

  constructor(private identityService: IdentityService, private breakpointObserver: BreakpointObserver, private overlay: OverlayContainer, private router: Router) {
    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => this.drawer.close());

    setInterval(() => { this.checkConnectivity(); }, 5000);
  }

  ngOnInit(): void {
    this.checkConnectivity();
    this.getUserInfo();

    this.themeToggleControl.valueChanges.subscribe((lightTheme) => {
      const lightClassName = 'lightTheme';
      this.className = lightTheme ? lightClassName : '';
      if (lightTheme) {
        this.overlay.getContainerElement().classList.add(lightClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(lightClassName);
      }
    });
  }

  getUrl(): string {
    return this.router.url;
  }

  changeTheme(): void {
    this.themeToggleControl.setValue(!this.themeToggleControl.value);
  }

  getUserInfo(): void {
    this.identityService.getUserIdentity()
      .subscribe(userIdentity => {
        this.userInfo = userIdentity.userId + '（' + userIdentity.orgName + '）';
        this.detailedUserInfo = '用户信息'
          + '\n用户 ID：' + userIdentity.userId
          + '\n组织名称：' + userIdentity.orgName
          + '\n部门类型：' + userIdentity.deptType
          + '\n部门级别：' + userIdentity.deptLevel
          + '\n部门名称：' + userIdentity.deptName
          + '\n上级部门名称：' + userIdentity.superDeptName;
        this.userCanApprove = Utils.isUserCanApprove(userIdentity);
      });
  }

  checkConnectivity(): void {
    this.identityService.checkConnectivity()
      .subscribe(isConnected => this.isConnected = isConnected);
  }
}
