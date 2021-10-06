export class RequiredArgumentError extends Error {
  constructor(argName: string) {
    super(`argument ${argName} is required`);
    this.name = 'RequiredArgumentError';
  }
}
