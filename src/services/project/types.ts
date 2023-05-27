export enum CodeLanguage {
  Python = 'python',
  Javascript = 'javascript',
  Java = 'java',
  Rust = 'rust',
}

export enum JavascriptCodeFramework {
  React = 'react',
  Angular = 'angular',
  Vue = 'vue',
  Nestjs = 'nestjs',
  Nextjs = 'nextjs',
  Express = 'express',
}

export type CodeFramework = JavascriptCodeFramework | undefined;

/*
export enum ProjectFieldKind {
  Text = 'text',
  Switch = 'switch',
  Select = 'select',
}

export interface IProjectField<ValueType> {
  id?: number;
  name: string;
  kind: ProjectFieldKind;
  value: ValueType | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequiredReduxProjectField<ValueType> {
  id: number;
  value: ValueType;
}

export interface OptionalReduxProjectField<ValueType> extends Partial<RequiredReduxProjectField<ValueType>> { }

export type ReduxProjectField<ValueType> = RequiredReduxProjectField<ValueType> | OptionalReduxProjectField<ValueType>;
*/
