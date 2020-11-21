import util from 'util';
import winston, { transports, format, Logger } from 'winston';
// @ts-ignore
import syslog from 'modern-syslog';
import chalk from 'chalk';
import { TransformableInfo } from 'logform';
import SyslogTransport from './transport';

type LogLevelType =
  | 'emerg'
  | 'alert'
  | 'crit'
  | 'error'
  | 'warning'
  | 'notice'
  | 'info'
  | 'debug';

enum LogLevel {
  emerg = 0,
  alert = 1,
  crit = 2,
  error = 3,
  warning = 4,
  notice = 5,
  info = 6,
  debug = 7,
}

export function colorByLevel(level: string, text: string): string {
  const tmp = ` ${text.toUpperCase()}${' '.repeat(8 - text.length)}`;
  switch (level) {
    case 'emerg':
      return chalk.black.bgGray(tmp);
    case 'alert':
      return chalk.black.bgMagenta(tmp);
    case 'crit':
      return chalk.black.bgMagentaBright(tmp);
    case 'error':
      return chalk.black.bgRed(tmp);
    case 'warning':
      return chalk.black.bgYellow(tmp);
    case 'notice':
      return chalk.black.bgCyan(tmp);
    case 'info':
      return chalk.black.bgGreen(tmp);
    case 'debug':
      return chalk.black.bgBlue(tmp);
    default:
      return chalk.black.bgWhite(tmp);
  }
}

export function colorMessageByLevel(level: string, text: string): string {
  switch (level) {
    case 'emerg':
      return chalk.gray(text);
    case 'alert':
      return chalk.magenta(text);
    case 'crit':
      return chalk.magentaBright(text);
    case 'error':
      return chalk.red(text);
    case 'warning':
      return chalk.yellow(text);
    case 'notice':
      return chalk.cyan(text);
    case 'info':
      return chalk.green(text);
    case 'debug':
      return chalk.blue(text);
    default:
      return chalk.white(text);
  }
}

function internalLog(params: any[]) {
  const tempStack = [];
  for (let i = 0; i < params.length; i += 1) {
    if (typeof params[i] === 'string') {
      tempStack.push(params[i]);
    } else {
      tempStack.push(util.inspect(params[i], { depth: null }));
    }
  }
  return tempStack.join(' ');
}

const { timestamp, combine, printf } = format;

export class LoggerLoader {
  private core: Logger;

  private level: LogLevel;

  constructor(service: string, level: LogLevelType) {
    syslog.init(service);
    this.core = winston.createLogger({
      level,
      levels: winston.config.syslog.levels,
      format: combine(
        timestamp(),
        printf(
          (info: TransformableInfo) =>
            `${info.timestamp} ${info.service} ${colorByLevel(
              info.level,
              info.level,
            )} ${colorMessageByLevel(info.level, info.message)}`,
        ),
      ),
      defaultMeta: { service },
      transports: [new transports.Console(), new SyslogTransport({ syslog })],
    });
    this.level = LogLevel[level];
    this.debug('Start new winston instance', 'service');
  }

  public emerg(...params: any[]): void {
    if (this.level >= LogLevel.emerg) this.core.emerg(internalLog(params));
  }

  public alert(...params: any[]): void {
    if (this.level >= LogLevel.alert) this.core.alert(internalLog(params));
  }

  public crit(...params: any[]): void {
    if (this.level >= LogLevel.crit) this.core.crit(internalLog(params));
  }

  public error(...params: any[]): void {
    if (this.level >= LogLevel.error) this.core.error(internalLog(params));
  }

  public warning(...params: any[]): void {
    if (this.level >= LogLevel.warning) this.core.warning(internalLog(params));
  }

  public notice(...params: any[]): void {
    if (this.level >= LogLevel.notice) this.core.notice(internalLog(params));
  }

  public info(...params: any[]): void {
    if (this.level >= LogLevel.info) this.core.info(internalLog(params));
  }

  public debug(...params: any[]): void {
    if (this.level >= LogLevel.debug) this.core.debug(internalLog(params));
  }
}

export default LoggerLoader;
