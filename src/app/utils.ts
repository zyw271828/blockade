import { formatDate } from '@angular/common';
import { CitRecord } from './cit-record';
import { Tce3Record } from './tce3-record';
import { UserIdentity } from './user-identity';

interface Dictionary<T> {
  [key: string]: T;
}

export class Utils {
  private static documentResourceTypes: Dictionary<string> = {
    Plain: '明文',
    Encrypted: '加密（链上）',
    Offchain: '加密（链下）'
  };

  private static documentTypes: Dictionary<string> = {
    DesignDocument: '设计',
    ProductionDocument: '生产',
    TransferDocument: '转移',
    UsageDocument: '使用',
    RepairDocument: '维修'
  };

  private static assetResourceTypes: Dictionary<string> = {
    Plain: '明文',
    Encrypted: '加密'
  };

  private static dataTypes: Dictionary<string> = {
    Document: '文档',
    EntityAsset: '实体资产'
  };

  private static authSessionStatuses: Dictionary<string> = {
    Pending: '未批复',
    Approved: '允许',
    Rejected: '拒绝'
  };

  static mask: string = '***';

  static getResourceType(metaType: string, resourceType: string): string {
    if (metaType === 'document') {
      return this.documentResourceTypes[resourceType];
    } else if (metaType === 'asset') {
      return this.assetResourceTypes[resourceType];
    } else {
      return '';
    }
  }

  static getResourceTypes(metaType: string): string[] {
    let resourceTypes: string[] = [];

    if (metaType === 'document') {
      Object.entries(this.documentResourceTypes).forEach(
        ([_, value]) => resourceTypes.push(value)
      );
    } else if (metaType === 'asset') {
      Object.entries(this.assetResourceTypes).forEach(
        ([_, value]) => resourceTypes.push(value)
      );
    }

    return resourceTypes;
  }

  static getRawResourceType(metaType: string, resourceType: string): string {
    let rawResourceType;

    if (metaType === 'document') {
      rawResourceType = Object.keys(this.documentResourceTypes).find(key => this.documentResourceTypes[key] === resourceType);
    } else if (metaType === 'asset') {
      rawResourceType = Object.keys(this.assetResourceTypes).find(key => this.assetResourceTypes[key] === resourceType);
    }

    return rawResourceType === undefined ? resourceType : rawResourceType;
  }

  static getDocumentType(documentType: string): string {
    return this.documentTypes[documentType];
  }

  static getDocumentTypes(): string[] {
    let documentTypes: string[] = [];

    Object.entries(this.documentTypes).forEach(
      ([_, value]) => documentTypes.push(value)
    );

    return documentTypes;
  }

  static getRawDocumentType(documentType: string): string {
    let rawDocumentType = Object.keys(this.documentTypes).find(key => this.documentTypes[key] === documentType);

    return rawDocumentType === undefined ? documentType : rawDocumentType;
  }

  static getDataType(dataType: string): string {
    return this.dataTypes[dataType];
  }

  static getDataTypes(): string[] {
    let dataTypes: string[] = [];

    Object.entries(this.dataTypes).forEach(
      ([_, value]) => dataTypes.push(value)
    );

    return dataTypes;
  }

  static getRawDataType(dataType: string): string {
    let rawDataType = Object.keys(this.dataTypes).find(key => this.dataTypes[key] === dataType);

    return rawDataType === undefined ? dataType : rawDataType;
  }

  static getAuthSessionStatus(authSessionStatus: string): string {
    return this.authSessionStatuses[authSessionStatus];
  }

  static getAuthSessionStatuses(): string[] {
    let authSessionStatuses: string[] = [];

    Object.entries(this.authSessionStatuses).forEach(
      ([_, value]) => authSessionStatuses.push(value)
    );

    return authSessionStatuses;
  }

  static getRawAuthSessionStatus(authSessionStatus: string): string {
    let rawAuthSessionStatus = Object.keys(this.authSessionStatuses).find(key => this.authSessionStatuses[key] === authSessionStatus);

    return rawAuthSessionStatus === undefined ? authSessionStatus : rawAuthSessionStatus;
  }

  static isUserCanApprove(userIdentity: UserIdentity): boolean {
    // TODO: determine if the user has permission to access the Auth Approve page, for example:
    // return userIdentity.userId === 'admin';
    return true;
  }

  static formatDate(date: string): string {
    return formatDate(date, 'long', 'zh-CN');
  }

  static getCitRecord(str: string): CitRecord {
    let split = str.split(',');
    let citRecord: CitRecord = {
      id: split[0],
      date: split[1],
      user: split[2],
      pc: split[3],
      activity: split[4]
    };

    return citRecord;
  }

  static getTce3Record(str: string): Tce3Record {
    let json = JSON.parse(str);
    let uuidIndex = str.indexOf('uuid');
    let tce3Record: Tce3Record = {
      uuid: str.substring(uuidIndex + 7, uuidIndex + 7 + 36),
      datum: JSON.stringify(json.datum),
      cdmVersion: json.CDMVersion,
      source: json.source
    };

    return tce3Record;
  }
}
