import type * as yup from 'yup';

type ParamsType = {
  type: string;
  errors: string[];
  path: string;
  params: {
    [key: string]: string;
  };
};

type ShapeFieldType = {
  [key: string]:
    | yup.StringSchema
    | yup.NumberSchema
    | yup.BooleanSchema
    | yup.DateSchema;
};

export type ErrorType = {
  inner: ParamsType[];
  errors: string[];
};

export type SchemaType = {
  body?: ShapeFieldType;
  query?: ShapeFieldType;
  params?: ShapeFieldType;
};
