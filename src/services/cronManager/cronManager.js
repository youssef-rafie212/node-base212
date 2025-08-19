import cron from "node-cron";

class CronManager {
    constructor() {
        this._jobs = {};
    }

    // ✅ Add a cron job
    add(id, periodText, fn) {
        if (this._jobs[id]) {
            console.warn(`⏳ Cron job ${id} already exists. Skipping...`);
            return;
        }

        this._jobs[id] = cron.schedule(periodText, fn, {
            scheduled: true,
            timezone: "UTC",
        });
        console.log(`✅ Scheduled job ${id} for ${periodText}`);
    }

    // ✅ Stop a cron job
    stop(id) {
        if (!this._jobs[id]) {
            console.warn(`⚠️ Cron job ${id} not found.`);
            return;
        }

        this._jobs[id].stop();
        console.log(`⏸️ Stopped job ${id}`);
    }

    // ✅ Restart a cron job (if stopped)
    restart(id) {
        if (!this._jobs[id]) {
            console.warn(`⚠️ Cron job ${id} not found.`);
            return;
        }

        this._jobs[id].start();
        console.log(`▶️ Restarted job ${id}`);
    }

    // ✅ Delete a cron job
    delete(id) {
        if (!this._jobs[id]) {
            console.warn(`⚠️ Cron job ${id} not found.`);
            return;
        }

        this._jobs[id].stop();
        delete this._jobs[id];
        console.log(`🗑️ Deleted job ${id}`);
    }

    // ✅ Stop all cron jobs
    stopAll() {
        Object.values(this._jobs).forEach((job) => job.stop());
        this._jobs = {};
        console.log("⏹️ Stopped all cron jobs");
    }

    // ✅ List all cron jobs
    list() {
        return this._jobs;
    }

    // ✅ Check if a job is running
    isRunning(id) {
        return this._jobs[id]
            ? this._jobs[id].getStatus() === "running"
            : false;
    }

    // ✅ Get job status
    getJobStatus(id) {
        if (!this._jobs[id]) {
            return "not_found";
        }
        return this._jobs[id].getStatus();
    }

    // ✅ List all job IDs
    listJobIds() {
        return Object.keys(this._jobs);
    }

    // ✅ Get job count
    getJobCount() {
        return Object.keys(this._jobs).length;
    }
}

export default new CronManager();
