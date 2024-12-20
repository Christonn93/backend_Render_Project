import os from 'os';
import { performance } from 'perf_hooks';

export const getSystemMetrics = () => ({
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
    loadAverage: os.loadavg(),
});

export const measurePerformance = (name: string, action: () => void) => {
    const start = performance.now();
    action();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
};
