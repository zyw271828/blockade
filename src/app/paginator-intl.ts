import { MatPaginatorIntl } from '@angular/material/paginator';

export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = '每页项目数：';
  paginatorIntl.previousPageLabel = '上一页';
  paginatorIntl.nextPageLabel = '下一页';
  paginatorIntl.firstPageLabel = '第一页';
  paginatorIntl.lastPageLabel = '最后一页';

  return paginatorIntl;
}
