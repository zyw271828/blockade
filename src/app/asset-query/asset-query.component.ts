import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from '../utils';

@Component({
  selector: 'app-asset-query',
  templateUrl: './asset-query.component.html',
  styleUrls: ['./asset-query.component.css']
})
export class AssetQueryComponent implements OnInit {
  queryMethods: string[] = [
    'ID',
    '条件'
  ];

  currentQueryMethod: string = this.queryMethods[0];

  assetIdQueryForm = this.fb.group({
    resourceType: [<string | null>null, Validators.required],
    resourceId: [<string | null>null, Validators.required]
  });

  assetConditionalQueryForm = this.fb.group({
    resourceId: <string | null>null,
    name: <string | null>null,
    isNameExact: <boolean | null>null,
    time: <string | null>null,
    timeAfterInclusive: <string | null>null,
    timeBeforeExclusive: <string | null>null,
    isTimeExact: <boolean | null>null,
    designDocumentId: <string | null>null
  });

  resourceTypes: string[] = Utils.getResourceTypes('asset');

  isResultShow: boolean = false;

  instruction: string = '实体资产查询页面上的一些说明。';

  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onIdQuerySubmit(): void {
    if (this.assetIdQueryForm.valid) {
      this.isResultShow = false;
      this.changeDetector.detectChanges();
      this.isResultShow = true;
    } else { // assetIdQueryForm is invalid
      this._snackBar.open('请检查您的输入', '关闭', {
        duration: 5000
      });
    }
  }

  onConditionalQuerySubmit(): void {
    if (this.assetConditionalQueryForm.valid) {
      this.checkConditionalQueryForm();
      this.isResultShow = false;
      this.changeDetector.detectChanges();
      this.isResultShow = true;
    } else { // assetConditionalQueryForm is invalid
      this._snackBar.open('请检查您的输入', '关闭', {
        duration: 5000
      });
    }
  }

  checkConditionalQueryForm(): void {
    let ine = this.assetConditionalQueryForm.get('isNameExact')?.value;
    let n = this.assetConditionalQueryForm.get('name')?.value;
    let ite = this.assetConditionalQueryForm.get('isTimeExact')?.value;
    let t = this.assetConditionalQueryForm.get('time')?.value;
    let tai = this.assetConditionalQueryForm.get('timeAfterInclusive')?.value;
    let tbe = this.assetConditionalQueryForm.get('timeBeforeExclusive')?.value;

    // Check isNameExact
    // | ine | true           | false          | null           |
    // | --- | -------------- | -------------- | -------------- |
    // | n   | do nothing     | do nothing     | ine -> false   |
    // | !n  | ine, n -> null | ine, n -> null | ine, n -> null |

    if (ine === null && n) { // Request is valid
      this.assetConditionalQueryForm.get('isNameExact')?.setValue(false);
    }
    if (!n) {
      this.assetConditionalQueryForm.get('name')?.setValue(null);
      this.assetConditionalQueryForm.get('isNameExact')?.setValue(null);
    }

    // Check isTimeExact
    // | isTimeExact    | true                     | false                    | null                     |
    // | -------------- | ------------------------ | ------------------------ | ------------------------ |
    // | !t, !tai, !tbe | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | !t, !tai, tbe  | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | !t, tai, !tbe  | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | !t, tai, tbe   | t, tai, tbe, ite -> null | t -> null                | t -> null, i -> false    |
    // | t, !tai, !tbe  | tai, tbe -> null         | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | t, !tai, tbe   | tai, tbe -> null         | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | t, tai, !tbe   | tai, tbe -> null         | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | t, tai, tbe    | tai, tbe -> null         | t -> null                | t -> null, i -> false    |

    if (!t) { // Time is invalid
      if (tai && tbe) { // Time range is valid
        if (ite === false) { // Request is valid
          this.assetConditionalQueryForm.get('time')?.setValue(null);
        } else if (ite === null) { // Request is valid
          this.assetConditionalQueryForm.get('time')?.setValue(null);
          this.assetConditionalQueryForm.get('isTimeExact')?.setValue(false);
        } else {
          this.assetConditionalQueryForm.get('time')?.setValue(null);
          this.assetConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
          this.assetConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
          this.assetConditionalQueryForm.get('isTimeExact')?.setValue(null);
        }
      } else { // Time range is invalid
        this.assetConditionalQueryForm.get('time')?.setValue(null);
        this.assetConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
        this.assetConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
        this.assetConditionalQueryForm.get('isTimeExact')?.setValue(null);
      }
    } else { // Time is valid
      if (ite === true) { // Request is valid
        this.assetConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
        this.assetConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
      } else if (ite === false && tai && tbe) { // Request is valid
        this.assetConditionalQueryForm.get('time')?.setValue(null);
      } else if (ite === null && tai && tbe) { // Request is valid
        this.assetConditionalQueryForm.get('time')?.setValue(null);
        this.assetConditionalQueryForm.get('isTimeExact')?.setValue(false);
      } else {
        this.assetConditionalQueryForm.get('time')?.setValue(null);
        this.assetConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
        this.assetConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
        this.assetConditionalQueryForm.get('isTimeExact')?.setValue(null);
      }
    }
  }

  resetIdQueryForm(): void {
    this.assetIdQueryForm.reset();
    this.isResultShow = false;
  }

  resetConditionalQueryForm(): void {
    this.assetConditionalQueryForm.reset();
    this.isResultShow = false;
  }
}
