import { createAgentRuntime } from "@milo/agent";
import { parseServiceConfig } from "./config.js";
import { createHealthServer } from "./http.js";

const main = async () => {
  const config = parseServiceConfig(process.env);
  const runtime = createAgentRuntime(config);
  const server = createHealthServer({ checkReady: runtime.checkReady });

  try {
    await runtime.start();
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(config.port, config.host, () => {
        server.off("error", reject);
        resolve();
      });
    });
  } catch (error) {
    await runtime.stop();
    throw error;
  }

  const logger = runtime.mastra.getLogger();
  logger.info("Milo agent service listening", {
    host: config.host,
    port: config.port,
  });

  let shutdownStarted = false;
  const shutdown = () => {
    if (shutdownStarted) {
      return;
    }
    shutdownStarted = true;

    const deadline = setTimeout(() => {
      logger.error("Agent service shutdown deadline exceeded");
      process.exit(1);
    }, 15_000);
    deadline.unref();

    const closeHttp = new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
      server.closeIdleConnections();
    });

    Promise.all([closeHttp, runtime.stop()])
      .then(() => {
        clearTimeout(deadline);
        logger.info("Milo agent service stopped");
      })
      .catch(() => {
        logger.error("Agent service shutdown failed");
        process.exit(1);
      });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

main().catch((error: unknown) => {
  // Do not dump provider errors, environment variables, or connection strings.
  const message =
    error instanceof Error &&
    error.message.startsWith("Invalid agent service configuration:")
      ? error.message
      : "Agent service startup failed; check database availability and configuration";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
