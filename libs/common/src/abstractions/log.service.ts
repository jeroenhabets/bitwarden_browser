import { LogLevelType } from "../enums";

export abstract class LogService {
  debug: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  write: (level: LogLevelType, message: string) => void;
}
