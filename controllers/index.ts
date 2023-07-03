import * as fs from "fs";
import { IRoute, RouteTypes } from "./../interfaces/index";
import path from "path";

export function isRouteValid(data: any): boolean {
  if (!data) return false;
  const allowedMethods: RouteTypes[] = [
    "post",
    "get",
    "delete",
    "put",
    "patch",
  ];
  return [
    data.url && data.url.length > 0,
    data.method && allowedMethods.includes(data.method),
    data.handler && data.handler instanceof Function,
  ].every((value: boolean) => !!value);
}

export async function getRoutes(): Promise<IRoute[]> {
  const routes: IRoute[] = [];
  const controllerFiles = await fetchFileInControllerDirectory(__dirname, [
    "index.js",
  ]);
  for (const route of controllerFiles) {
    const realRouteData = require(route).default;
    if (isRouteValid(realRouteData)) {
      routes.push(realRouteData);
    }
  }
  return routes;
}

export async function fetchFileInControllerDirectory(
  rootDir: string,
  filesToIgnore?: string[],
): Promise<string[]> {
  const files: string[] = [];

  try {
    const items = await fs.promises.readdir(rootDir);

    const directories = items.filter(item => {
      const itemPath = path.join(rootDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    for (const directory of directories) {
      const realPath = path.join(rootDir, directory);
      const itemStats = await fs.promises.stat(realPath);
      if (itemStats.isDirectory()) {
        const filesInDirectory = fs
          .readdirSync(realPath)
          .map((file: string) => {
            if (!filesToIgnore.includes(file)) return `${realPath}/${file}`;
            return "";
          });

        files.push(...filesInDirectory);
      }
    }
    return files;
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    return [];
  }
}
