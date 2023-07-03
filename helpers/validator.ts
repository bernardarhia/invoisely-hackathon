import { Request } from "express";

interface DefaultOtherRuleType<T = any> {
  value: T;
  message: string;
}

export interface ValidationRule {
  required?:
    | boolean
    | [(req: Request, val: any) => Promise<boolean> | boolean, string?]
    | Promise<boolean | [boolean, string?]>
    | ((req: Request, val: any) => Promise<boolean> | boolean);
  sanitize?: (val: any) => any;
  fieldName?: string;
  in?: any[];
  exclude?: string | DefaultOtherRuleType<string | number>;
  include?: string | DefaultOtherRuleType<string | number>;
  match?: RegExp | DefaultOtherRuleType;
  minLength?: number | DefaultOtherRuleType<number>;
  maxLength?: number | DefaultOtherRuleType<number>;
  minValue?: number | DefaultOtherRuleType<number>;
  maxValue?: number | DefaultOtherRuleType<number>;
  email?: boolean | DefaultOtherRuleType<string>;
  dataType?: "string" | "boolean" | "number" | "array";
  date?: boolean | DefaultOtherRuleType<boolean>;
  sameAs?: string | DefaultOtherRuleType;
  isValidMongoId?: boolean | ((value: string) => boolean);
}

export class Validator {
  static validateRequestBody(rules: Record<string, ValidationRule>) {
    return async (req: any, res: any, next: any) => {
      if (!rules || Object.keys(rules).length === 0) return next();
      if (!isValidRule(rules)) {
        return next();
      } else {
        const errors: string[] = await bundleValidation(rules, req, "body");
        if (errors.length > 0) {
          return res.status(400).json({ error: true, message: errors[0] });
        }
        return next();
      }
    };
  }

  static validateRequestParams(rules: Record<string, ValidationRule>) {
    return async (req: any, res: any, next: any) => {
      if (!isValidRule(rules)) {
        return next();
      } else if (!rules || Object.keys(rules).length === 0) {
        return next();
      } else {
        const errors: string[] = await bundleValidation(rules, req, "params");
        if (errors.length > 0) {
          return res.status(400).json({ error: true, message: errors[0] });
        }
        return next();
      }
    };
  }

  static validateRequestQueries(rules: Record<string, ValidationRule>) {
    return async (req: any, res: any, next: any) => {
      if (!isValidRule(rules)) {
        return next();
      } else if (!rules || Object.keys(rules).length === 0) {
        return next();
      } else {
        const errors: string[] = await bundleValidation(rules, req, "query");
        if (errors.length > 0) {
          return res.status(400).json({ error: true, message: errors[0] });
        }
        return next();
      }
    };
  }
}

export function hasValue(value: any): boolean {
  return value !== undefined && value !== null && value.length > 0;
}

export function isValidRule(object: any): boolean {
  return object && Object.keys(object).length > 0;
}

async function bundleValidation(
  rules: Record<string, ValidationRule>,
  req: Request,
  validationIsFor: "params" | "body" | "query",
): Promise<string[]> {
  const errors: string[] = [];
  for (const [field, rule] of Object.entries(rules)) {
    const value = req[validationIsFor][field] || "";
    const ruleKeys = Object.keys(rule);

    // RULE CHECK FOR REQUIRED
    if (ruleKeys.includes("required")) {
      if (
        typeof rule.required === "boolean" &&
        rule.required &&
        !hasValue(value)
      ) {
        errors.push(`${rule.fieldName || field} is required`);
      } else if (Array.isArray(rule.required)) {
        if (
          (rule.required[0] instanceof Function &&
            rule.required[0](req, value)) ||
          typeof rule.required[0] === "boolean"
        ) {
          const actualError = rule.required[1] || "";
          errors.push(actualError || `${rule.fieldName || field} is required `);
        }
      } else if (
        rule.required instanceof Function &&
        rule.required(req, value)
      ) {
        errors.push(`${rule.fieldName || field} is required `);
      }
    }

    if (rule.sanitize) {
      req.body[field] = rule.sanitize(value);
    }

    if (rule.dataType && typeof value !== rule.dataType) {
      errors.push(
        `${rule.fieldName || field} expected ${
          rule.dataType
        } but got ${typeof value}`,
      );
    }

    if (rule.in && !rule.in.includes(value)) {
      errors.push(
        `${rule.fieldName || field} must be in ${rule.in.join(",").trim()}`,
      );
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push(
        `${rule.fieldName || field} must have a min length of ${
          rule.minLength
        }`,
      );
    }
  }
  return errors;
}
