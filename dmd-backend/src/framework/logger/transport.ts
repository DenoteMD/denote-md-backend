import Transport from 'winston-transport';

function getLevelLabel(level: string): string {
  return ` ${level.toUpperCase()}${' '.repeat(8 - level.length)}`;
}

export class SyslogTransport extends Transport {
  private syslogInstance: any;

  constructor(opts?: any) {
    super(opts);
    this.syslogInstance = opts.syslog;
  }

  log(info: any, callback: Function) {
    this.syslogInstance.log(
      info.level,
      `${getLevelLabel(info.level)} ${info.message}`,
    );
    setImmediate(() => {
      this.emit('logged', info);
    });
    callback();
  }
}

export default SyslogTransport;
