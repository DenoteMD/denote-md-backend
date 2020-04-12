export interface ErrorInterface {
  message: string;
  stack:string;
}

export interface Ordering {
  column: string
  order: RecordOrdering
}

export enum RecordOrdering {
  asc = 'asc',
  desc = 'desc'
}

export interface Pagination {
  offset: number;
  limit: number;
  order: Ordering[];
}

export interface RecordList {
  total: number;
  offset: number;
  order: Ordering[];
  limit: number;
  records: Record[]
}

export interface Record {
  [key: string]: any
}

export interface ResponseRecord {
  success: boolean;
  deprecated?: boolean;
  result: Record;
}

export interface ResponseList {
  success: boolean;
  deprecated?: boolean;
  result: RecordList
}

export interface ResponseError {
  success: boolean;
  deprecated?: boolean;
  result: ErrorInterface;
}
