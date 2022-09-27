import { transports, createLogger } from "winston";

const logLevel = process.env.LOG_LEVEL ?? "info";
export const logger = createLogger({
  level: logLevel,
  transports: [
    new transports.Console({
      // (We need to override the standard Console transport to get it working with VSCode)
      // https://github.com/winstonjs/winston/issues/1544
      log(info, callback) {
        const transport = this as transports.ConsoleTransportInstance;
        setImmediate(() => transport.emit("logged", info));

        if (transport.stderrLevels[info.LEVEL]) {
          console.error(info.message);

          if (callback) {
            callback();
          }
          return;
        }

        console.log(info.message);

        if (callback) {
          callback();
        }
      },
    }),
  ],
});
export const info = function (arg: unknown) {
  logger.info(arg);
};
export const warn = function (arg: unknown) {
  logger.warn(arg);
};
export const error = logger.error;
export default logger;
