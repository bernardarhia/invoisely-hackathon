import { PopulateOptions } from "mongoose";
import { AuthRequest } from "../middleware";

export const returnDuplicates = (data: any[]): any[] => {
  return data.filter((item, index) => data.indexOf(item) !== index);
};
export const range = (start: number, end: number, step: number = 1) => {
  const len = Math.floor((end - start) / step) + 1;
  return Array(len)
    .fill(start, end)
    .map((_, i) => start + i * step);
};

export const formatModelProjection = <T>(
  includes?: (keyof T)[],
  excludes?: (keyof T)[],
): Record<keyof T, number> => {
  const includesFormatted: Record<keyof T, number> = {} as Record<
    keyof T,
    number
  >;
  const excludeFormatted: Record<keyof T, number> = {} as Record<
    keyof T,
    number
  >;

  if (includes && includes.length) {
    for (const field of includes) {
      includesFormatted[field] = 1;
    }
  }
  if (excludes && excludes.length) {
    for (const field of excludes) {
      excludeFormatted[field] = 0;
    }
  }
  return { ...includesFormatted, ...excludeFormatted };
};
export const formatModelPopulate = (
  fieldsToPopulate: Record<string, string[]>,
): PopulateOptions[] => {
  const fields: PopulateOptions[] = [];
  // { path: 'author', select: 'name email' },
  for (const field in fieldsToPopulate) {
    fieldsToPopulate[field].length
      ? { select: fieldsToPopulate[field].join(" ") }
      : {};
    fields.push({
      path: field,
    });
  }
  return fields;
};