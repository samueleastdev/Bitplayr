import { SdkConfig } from '../configs/sdkConfig';
import { SDKLogger } from '../logger/logger';

export function WithTelemetry(
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  const logger = new SDKLogger(SdkConfig.getConfig().logLevel);

  descriptor.value = function (...args: any[]) {
    if (!SdkConfig.getConfig().telemetryEnabled) {
      return originalMethod.apply(this, args);
    }

    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const finish = performance.now();

    logger.telemetry(`Execution time for ${String(propertyKey)}: ${finish - start} ms`);

    return result;
  };

  return descriptor;
}
