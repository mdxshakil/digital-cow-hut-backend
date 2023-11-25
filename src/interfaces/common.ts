export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    pageCount?: number;
  };
  data: T;
};
