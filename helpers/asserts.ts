export function assert(condition: any, message?: string | Error | undefined) {
  if (
    condition === undefined ||
    condition === false ||
    condition === null ||
    !condition
  ) {
    if (typeof message == "string") {
      throw new Error(message);
    } else if (message instanceof Error) {
      throw message;
    } else throw new Error("An error occurred while processing your request");
  }
}
