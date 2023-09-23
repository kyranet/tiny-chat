import { createInterface } from 'readline';

export function createInputReader(sendCb, ws) {
	const reader = createInterface({
		input: process.stdin,
		output: undefined
	});
	reader.on('line', (line) => {
		sendCb(line);
	});

	ws.on('close', () => reader.close());
}
