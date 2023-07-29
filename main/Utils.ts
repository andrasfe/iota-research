const os = require('os');

export class Utils {
    constructor() { }

    cpuAverage() {
        let totalIdle = 0, totalTick = 0;
        const cpus = os.cpus();

        for(let i = 0, len = cpus.length; i < len; i++) {
            let cpu = cpus[i];
            for(let type in cpu.times) {
                totalTick += cpu.times[type];
            }     
            totalIdle += cpu.times.idle;
        }

        return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
    }

    heapUsed() {
        return process.memoryUsage().heapUsed
    }

    memAsString() {
        return `${os.totalmem()},${os.freemem()},${process.memoryUsage().rss},${process.memoryUsage().heapTotal},${process.memoryUsage().heapUsed}\n`;        
    }
}
