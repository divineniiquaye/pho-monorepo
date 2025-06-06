import logSymbols from "log-symbols";
import ora from "ora";

/** A logger for GitHub Cache */
export class Logger {
    private spinner = ora();
    /**
     * Log an informational message
     */
    info(message: string): void {
        console.log(`${logSymbols.info} ${message}`);
    }

    /**
     * Log a success message
     */
    success(message: string): void {
        console.log(`${logSymbols.success} ${message}`);
    }

    /**
     * Log an error message
     */
    error(message: string, error?: unknown): void {
        console.error(`${logSymbols.error} ${message}`);
        if (error instanceof Error) {
            console.error(`  └─ ${error.message}`);
        } else if (error !== undefined) {
            console.error(`  └─ ${String(error)}`);
        }
    }

    /**
     * Log a warning message
     */
    warn(message: string): void {
        console.warn(`${logSymbols.warning} ${message}`);
    }

    /**
     * Start a spinner with the given message
     */
    startSpinner(message: string): void {
        this.spinner.start(message);
    }

    /**
     * Update the spinner message
     */
    updateSpinner(message: string): void {
        this.spinner.text = message;
    }

    /**
     * Stop the spinner with a success message
     */
    succeedSpinner(message: string): void {
        this.spinner.succeed(message);
    }

    /**
     * Stop the spinner with an error message
     */
    failSpinner(message: string): void {
        this.spinner.fail(message);
    }
}

export const logger = new Logger();
