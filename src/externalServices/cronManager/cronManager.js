import cron from "node-cron";

// cron job manager that manages cron jobs
class CronManager {
    constructor() {
        // track all cron jobs
        this._jobs = {};
    }

    // add a cron job
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

    // stop a cron job
    stop(id) {
        if (!this._jobs[id]) {
            console.warn(`⚠️ Cron job ${id} not found.`);
            return;
        }

        this._jobs[id].stop();
        console.log(`⏸️ Stopped job ${id}`);
    }

    // restart a cron job (if stopped)
    restart(id) {
        if (!this._jobs[id]) {
            console.warn(`⚠️ Cron job ${id} not found.`);
            return;
        }

        this._jobs[id].start();
        console.log(`▶️ Restarted job ${id}`);
    }

    // delete a cron job
    delete(id) {
        if (!this._jobs[id]) {
            console.warn(`⚠️ Cron job ${id} not found.`);
            return;
        }

        this._jobs[id].stop();
        delete this._jobs[id];
        console.log(`🗑️ Deleted job ${id}`);
    }

    // stop all cron jobs
    stopAll() {
        Object.values(this._jobs).forEach((job) => job.stop());
        console.log("⏹️ Stopped all cron jobs");
    }

    // list all cron jobs
    list() {
        return this._jobs;
    }

    // check if a job is running
    isRunning(id) {
        return this._jobs[id]
            ? this._jobs[id].getStatus() === "running"
            : false;
    }

    // get job status
    getJobStatus(id) {
        if (!this._jobs[id]) {
            return "not_found";
        }
        return this._jobs[id].getStatus();
    }

    // list all job IDs
    listJobIds() {
        return Object.keys(this._jobs);
    }

    // get job count
    getJobCount() {
        return Object.keys(this._jobs).length;
    }
}

// singleton cron job manager instance
export default new CronManager();
