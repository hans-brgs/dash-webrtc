/*
 * Conditional logging method that only logs if the 'debug' prop is set to true.
 * @param {string} componentName - Name of the component
 * @param {boolean} debugMode - Enable debug mode
 * @returns {object} - Logger object with log method
 * @example
 * const logger = logger('MyComponent', true);
 * logger.log('info', 'This is an info message', { data: 'some data' });
 * logger.log('warn', 'This is a warning message', { data: 'some data' });
 * logger.log('error', 'This is an error message', { data: 'some data' });
 */
export default function logger(componentName, debugMode = false) {
	return {
		log: (level = 'log', message, data) => {
			// Helper function for actual logging
			const doLog = (level, message, data) => {
				const logFn = console[level] || console.log;
				const prefix = `[${componentName}] ${new Date().toISOString().slice(11, 23)} -`;
				if (data) {
					logFn(prefix, message, data);
				} else {
					logFn(prefix, message);
				}
			};

			// Log only if debug mode is enabled
			if (debugMode) {
				doLog(level, message, data);
			} else if (level === 'error') {
				doLog(level, message, data);
			}
		}
	}
}