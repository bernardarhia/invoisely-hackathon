import dotenv from "dotenv";
dotenv.config({
  path:
    process.env.NODE_ENV !== "production"
      ? `.env.${process.env.NODE_ENV}`
      : ".env",
});
import { HttpServer } from "./../interfaces/index";
import { IData, RouteTypes } from "../interfaces";
import express, {
  Application,
  RequestHandler,
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser";
import { getRoutes } from "../controllers";
import authMiddleware, { AuthRequest } from "../middleware";
import { AppError, ErrorHandler } from "../helpers/errors";
import { isFunction } from "lodash";
import { Validator } from "../helpers/validator";
import { hasCorrectHttpVerb } from "../utils";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import trebble from '@treblle/express'
const { MAIN_ORIGIN = "" } = process.env;
export class App implements HttpServer {
  public app: Application;
  private router: Router;

  constructor(appData: { name: string; version: number | string }) {
    console.log({ appData });
    this.app = express();
    this.router = Router();
  }
  addRoute(
    method: RouteTypes,
    url: string,
    handler: RequestHandler,
    data: IData,
  ) {
    const dataExists = data && Object.keys(data);
    const reqBody =
      dataExists && data.rules && data.rules.body ? data.rules.body : {};
    const reqParams =
      dataExists && data.rules && data.rules.params ? data.rules.params : {};
    const reqQuery =
      dataExists && data.rules && data.rules.query ? data.rules.query : {};

    this.router[method](
      url,
      [
        async function checkRequestLimit(
          req: Request,
          res: Response,
          next: NextFunction,
        ): Promise<void> {
          if (
            dataExists &&
            data.requestRateLimiter &&
            Object.keys(data.requestRateLimiter).length > 2
          ) {
            await authMiddleware.rateLimit(
              req,
              res,
              next,
              data.requestRateLimiter,
            );
          } else next();
        },
        async function verifyAuthMiddleware(
          req: Request,
          res: Response,
          next: NextFunction,
        ): Promise<void> {
          if (data && data.requireAuth) {
            await authMiddleware.checkAuth(req, res, next);
          } else next();
        },

        async function permittedRolesMiddleware(
          req: AuthRequest,
          res: Response,
          next: NextFunction
        ): Promise<void> {
          if (data && data.permittedRoles && data.permittedRoles.length) {
            if (!data.permittedRoles.includes(req.user.role)) return next(new AppError(403, "Forbidden"));
            return next();
          }
          else next();
        },
        Validator.validateRequestBody(reqBody),
        Validator.validateRequestParams(reqParams),
        Validator.validateRequestQueries(reqQuery),
        async function middlewareCustomAuth(
          req: Request,
          res: Response,
          next: NextFunction,
        ) {
          if (dataExists && data.customAuth && isFunction(data.customAuth)) {
            await data.customAuth(req, res, next);
            next();
          } else {
            next();
          }
        },
      ],
      handler,
    );
  }

  async addRoutes(): Promise<void> {
    const routes = await getRoutes();
    for (const route of routes) {
      const { method, url, data, handler } = route;
      if (hasCorrectHttpVerb(method) && handler instanceof Function) {
        this.addRoute(method, url, handler, data);
      }
    }
  }

  async start(port: number) {
    await this.addRoutes();
    this.config();
    this.app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  }
  private config(){
  
    this.app.use(
      cors({
        origin: [MAIN_ORIGIN], // Allow requests from this origin
        methods: "GET, POST, DELETE, PUT", // Allow these HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
        credentials: true, // Allow cookies to be sent with requests
        maxAge: 86400, // Cache preflight requests for one day
        optionsSuccessStatus: 204, // Respond with a 204 No Content status for preflight requests
        exposedHeaders: ["set-cookie"],
      }),
    );
    if(!["development", "testing"].includes(process.env.NODE_ENV)){
      this.app.use(trebble({
        apiKey: process.env.TREBLLE_API_KEY,
        projectId: process.env.TREBLLE_PROJECT_ID,
        additionalFieldsToMask: [],
      }))
    }

    this.app.use(cookieParser());


    this.app.disable("x-powered-by");
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({ extended: false, limit: "50kb" }));
    this.app.use(bodyParser.json());
        // set default security settings
        this.app.use(helmet());
        this.app.use(helmet.contentSecurityPolicy({
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", MAIN_ORIGIN],
            styleSrc: ["'self'", MAIN_ORIGIN],
            imgSrc: ["'self'", MAIN_ORIGIN],
          },
        }));
    
        // ALLOW CLIENTS TO ACCESS API USING HTTPS
        this.app.use(helmet({
          hsts: {
            maxAge: 31536000, // 1 year in seconds
            includeSubDomains: true
          }
        }))
        this.app.use(helmet.frameguard({ action: 'sameorigin' }));
    // use express-mongo-sanitize
    this.app.use(
      mongoSanitize({
        replaceWith: "_",
        allowDots: true,
        dryRun: true,
        onSanitize: ({ key, req }) => {
          console.warn({ key });
        },
      }),
    );
    // use xss
    this.app.use((req, res, next) => {
      res.setHeader('X-Frame-Options', 'DENY');
      const allowedRoutes = [];
      const currentRoute = req.url;
      if (!allowedRoutes.includes(currentRoute)) {
        xss(req, res, next);
      }
      next();
    });
    // use hpp to prevent Parameter Pollution attacks
    this.app.use(hpp());

    // set default security settings
    this.app.use(helmet());

    this.app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", MAIN_ORIGIN],
        styleSrc: ["'self'", MAIN_ORIGIN],
        imgSrc: ["'self'", MAIN_ORIGIN],
      },
    }));

    // ALLOW CLIENTS TO ACCESS API USING HTTPS
    this.app.use(helmet({
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true
      }
    }))
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (process.env.NODE_ENV !== "test") {
        console.debug({
          headers: req.headers,
          host: req.hostname,
          method: req.method,
          url: req.url,
          statusCode: req.statusCode,
          body: req.body || {},
          userAgent: req["user-agent"] || "",
          ip: req.ip,
          cookies: req.cookies,
        });
      }
      next();
    });
    this.app.use(this.router);
    this.app.all("*", (req, res, next) => {
      res.status(404).send("Route not found");
      next();
    });
    this.app.use(ErrorHandler.handle);
  }
}
