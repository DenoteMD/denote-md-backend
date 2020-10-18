export interface IError {
  message: string;
  stack?: string;
}

export interface IOrdering {
  column: string;
  order: 'asc' | 'desc';
}

export interface IPagination {
  offset: number;
  limit: number;
  order: IOrdering[];
}

export interface IRecordList<T> extends IPagination {
  total: number;
  records: T[];
}

export interface IResponseRecord<T> {
  success: boolean;
  deprecated?: boolean;
  result: T;
}

export interface IResponseList<T> {
  success: boolean;
  deprecated?: boolean;
  result: IRecordList<T>;
}

export interface IResponseError {
  success: boolean;
  deprecated?: boolean;
  result: IError;
}

export interface IResponseCommon<T> {
  success: boolean;
  deprecated?: boolean;
  result: IError | IRecordList<T> | T;
}
