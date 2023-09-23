import { cyan, gray, green, italic, magenta, red } from 'colorette';
import { WebSocket } from 'ws';

export function createClient(ip, port = 8080) {
	const ws = new WebSocket(`ws://${ip}:${port}`);
	ws.on('close', () => console.log(red('[WS]'), 'Closed connection'));
	ws.on('error', (error) => console.error(red('[WS]'), 'Received error:', error));
	ws.on('message', (message) => {
		console.log(gray('>'), italic(magenta(message.toString('utf8'))));
	});
	ws.on('open', () => console.log(green('[WS]'), 'Successfully connected to', cyan(`${ip}:${port}`)));

	function send(message) {
		ws.send(message, (error) => {
			if (error) {
				if (error) console.error(red('[WS]'), 'Error while sending message:', error);
			}
		});
	}

	return { ws, send };
}
