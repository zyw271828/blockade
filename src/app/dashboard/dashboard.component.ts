import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  contractsNodeWsPort = environment.contractsNodeWsPort;
  url: string = `https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A${this.contractsNodeWsPort}#/explorer`;

  constructor() { }

}
