import { formatDate } from "@angular/common";

export class Utils {
  private static documentResourceTypes: string[] = [
    '明文',
    '加密（链上）',
    '加密（链下）'
  ];

  private static documentTypes: string[] = [
    '设计',
    '生产',
    '使用',
    '维修',
    '转移'
  ];

  private static assetResourceTypes: string[] = [
    '明文',
    '加密'
  ];

  private static authSessionStatus: string[] = [
    '未批复',
    '允许',
    '拒绝'
  ];

  static getResourceTypes(supertype: string): string[] {
    if (supertype === 'document') {
      return this.documentResourceTypes;
    } else if (supertype === 'asset') {
      return this.assetResourceTypes;
    } else {
      return [];
    }
  }

  static getDocumentTypes(): string[] {
    return this.documentTypes;
  }

  static getAuthSessionStatus(): string[] {
    return this.authSessionStatus;
  }

  static formatDate(date: string): string {
    return formatDate(date, 'long', 'en-US');
  }
}
