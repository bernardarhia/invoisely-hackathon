import { Types } from "mongoose";
import { AppError } from "../helpers/errors";
import { RouteTypes } from "./../interfaces/index";
import { Request } from "express";
export function hasCorrectHttpVerb(httpVerb: RouteTypes): boolean | void {
  if (!["post", "get", "put", "delete"].includes(httpVerb)) {
    new AppError(500, "Invalid http method");
  }
  return true;
}

export const selectRandomItem = <T>(data: T[]): T => {
  const convertedArray = Array.from(data);
  return data[Math.floor(Math.random() * convertedArray.length)];
};

interface QueryBuilderResult {
  filter: any;
  options: any;
}

export function queryBuilder(
  reqQuery: any,
  searchableFields: string[],
): QueryBuilderResult {
  const { search, searchSelection, limit, sort, currentPage } = reqQuery;

  // Filter
  let filter: any = {};
  if (search && searchSelection && searchableFields.includes(searchSelection)) {
    // Build the $or array for searching in the specified field
    filter[searchSelection] = { $regex: search, $options: "i" };
  } else if (search) {
    // Build the $or array for searching in multiple fields
    const orConditions = searchableFields.map((field: string) => ({
      [field]: { $regex: search, $options: "i" },
    }));

    filter.$or = orConditions;
  }

  // Options
  let options: any = {};

  // // Selection
  // if (selection) {
  //   const fields = selection.split(",");
  //   options.select = fields.join(" ");
  // }

  // Limit
  if (limit) {
    options.limit = parseInt(limit);
  }

  // Sort
  if (sort) {
    const sortFields = sort.split(",");
    const sortOptions: any = {};
    sortFields.forEach((field: string) => {
      if (field.startsWith("-")) {
        sortOptions[field.substring(1)] = -1; // Descending order
      } else {
        sortOptions[field] = 1; // Ascending order
      }
    });
    options.sort = sortOptions;
  }

  // Pagination
  const perPage = parseInt(limit) || 10;
  const page = parseInt(currentPage) || 1;
  const skip = (page - 1) * perPage;
  options.skip = skip;

  return { filter, options };
}

export const buildUpdatePayload = (data: Record<string, any>) => {
  const filteredData = Object.entries(data).reduce((result, [key, value]) => {
    if (value) {
      result[key] = value;
    }
    return result;
  }, {});

  return filteredData;
};

export const getRandomId = (min = 0, max = 500000) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num.toString().padStart(6, "0");
};
