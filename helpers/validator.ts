
import { AuthRequest } from "../middleware";

export interface ValidationRule {
  required?:
    | boolean
    | [(req: AuthRequest, val: any) => Promise<boolean> | boolean, string?]
    | Promise<boolean | [boolean, string?]>
    | ((req: AuthRequest, val: any) => Promise<boolean> | boolean);

  authorize?:
    | boolean
    | ((req: AuthRequest, val: any) => Promise<boolean> | boolean)
    | ((req: AuthRequest, val: any) => Promise<boolean> | boolean)[];

  validate?:
    | boolean
    | ((
        req: AuthRequest,
        arg: any,
      ) => boolean | Promise<boolean | [boolean, string]> | [boolean, string?])
    | [(req: AuthRequest, val: any) => boolean | Promise<boolean>, string?]
    | ((
        req: AuthRequest,
        arg: any,
      ) =>
        | boolean
        | Promise<boolean | [Function | boolean, string?]>
        | [Function | boolean, string?])[];

  sanitize?: (val: any) => any;
  fieldName?: string;
}
export class Validator {
  static validateRequestBody(rules: Record<string, ValidationRule>) {
    return async (req: any, res: any, next: any) => {
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
  req: AuthRequest,
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

    // RULE CHECK FOR AUTHORIZE
    if (ruleKeys.includes("authorize")) {
      if (
        (rule.authorize instanceof Function &&
          !(await rule.authorize(req, value))) ||
        (typeof rule.authorize === "boolean" && !rule.authorize)
      ) {
        errors.push(`Access to this resource is denied`);
      } else if (Array.isArray(rule.authorize)) {
        for (const authorizeFn of rule.authorize) {
          if (!authorizeFn(req, value)) {
            errors.push(`Access to this resource is denied`);
          }
          break; //break for the first try
        }
      }
    }

    // RULES FOR VALIDATION
    if (ruleKeys.includes("validate")) {
      const validators = Array.isArray(rule.validate)
        ? rule.validate
        : [rule.validate];
      const generalValidateError = validators[1]
        ? (validators[1] as string)
        : `${rule.fieldName || field} is invalid.`;
      for (const validator of validators) {
        if (typeof validator === "boolean" && !validator) {
          errors.push(generalValidateError);
        } else if (typeof validator === "function") {
          const result = validator(req, value);
          if (typeof result === "boolean" && !result) {
            errors.push(generalValidateError);
          } else if (Array.isArray(result)) {
            const [validatorFunc, errorMessage] = result;
            if (
              typeof validatorFunc === "function" &&
              !validatorFunc(req, value)
            ) {
              errors.push(errorMessage || generalValidateError);
            }
            if (typeof validatorFunc === "boolean" && !validatorFunc) {
              errors.push(errorMessage || generalValidateError);
            }
          }
        }
      }
    }

    if (rule.sanitize) {
      req.body[field] = rule.sanitize(value);
    }
  }
  return errors;
}