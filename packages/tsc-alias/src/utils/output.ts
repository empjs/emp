/**
 * @file
 *
 * Keeping formatting consistent in large projects is difficult.
 * That's why this output class exists, it is used to standardize
 * logging and assertions.
 */

/** */
import { IOutput } from '../interfaces';

export class Output implements IOutput {
  constructor(private verb = false) {}

  public set verbose(value: boolean) {
    if (value) {
      this.verb = value;
    }
  }

  info(message: string) {
    if (!this.verb) return;
    console.log(`tsc-alias info: ${message}`);
  }

  error(message: string, exitProcess = false) {
    console.error(
      //[BgRed]tsc-alias error:[Reset] [FgRed_]${message}[Reset]
      `\x1b[41mtsc-alias error:\x1b[0m \x1b[31m${message}\x1b[0m`
    );

    if (exitProcess) process.exit(1);
  }

  clear() {
    console.clear();
  }

  assert(claim: unknown, message: string) {
    claim || this.error(message, true);
  }
}
