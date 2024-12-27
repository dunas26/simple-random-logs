export function main() {
	randomLog({
		interval: getEnv("LOG_INTERVAL", 500),
		intervalRandomOffset: getEnv("LOG_INTERVAL_RANDOM_OFFSET", 5000),
		descriptions: [
			{ type: "log", message: () => "Hello World" },
			{ type: "error", message: () => "Something went wrong" },
			{ type: "warn", message: () => "Please review this log" },
		]
	})
}

export type LogType = "log" | "error" | "warn";

export interface LogDescription {
	type: LogType;
	message: () => string;
}

export interface RandomLogOpts {
	interval: number;
	intervalRandomOffset: number;
	descriptions: LogDescription[];
}

function getEnv<T>(envName: string, defaultValue: T): number | typeof defaultValue {
	return Deno.env.has(envName) ? parseInt(Deno.env.get(envName)!) : defaultValue
}

export function randomLog(opts: RandomLogOpts) {
	const { interval, intervalRandomOffset, descriptions } = opts;
	const value = interval + Math.random() * intervalRandomOffset;

	setInterval(() => {
		const pickLog =
			descriptions[Math.floor(Math.random() * descriptions.length)];
		const { message, type } = pickLog;
		const msg = `[${type.toUpperCase()}] ${message()} -> ${
			new Date().toUTCString()
		}`;

		switch (type) {
			case "error":
				console.error(msg);
				break;
			case "log":
				console.log(msg);
				break;
			case "warn":
				console.warn(msg);
				break;
		}
	}, value);
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	main();
}
