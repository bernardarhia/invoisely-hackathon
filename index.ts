import Database from "./core/database";
import { assert } from "./helpers/asserts";
import { App } from "./core/app";

const { APP_PORT = 3000, ROOT_URI = "" } = process.env;

class Server {
  private server: App;

  constructor() {
    this.server = new App({ name: "Live Http Server", version: "1.0.0" });
    this.init().catch(error => {
      console.log({
        error: "An error occurred on the server connection",
        details: error.message,
      });
      process.exit(1); // Exit the process with a non-zero code to indicate failure
    });
  }

  private async init(): Promise<void> {
    assert(ROOT_URI, "Database URI required");
    try {
      await Database.start(ROOT_URI);
      this.server.start(Number(APP_PORT));
      console.log("Server started");
    } catch (error) {
      console.log({
        error: "An error occurred on the database connection",
        details: error.message,
      });
      await this.kill();
      process.exit(1); // Exit the process with a non-zero code to indicate failure
    }
  }

  private async kill(): Promise<void> {
    await Database.disconnect();
  }
}

new Server();
