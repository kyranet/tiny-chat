import { bgRed, bgYellow, cyan, gray, green, italic, magenta, red, white, yellow } from 'colorette';
import { networkInterfaces } from 'os';
import { WebSocketServer } from 'ws';

export function createServer(port = 8080) {
	const wss = new WebSocketServer({ port });
	const clients = new Set();

	wss.on('listening', () => {
		console.log(bgYellow(white('[WSS]')), `Listening on port ${port}`);
		logPossibleIps(port);
	});
	wss.on('error', (error) => {
		console.error(bgRed(white('[WSS] ERROR')), error);
	});
	wss.on('connection', (ws) => {
		console.log(green('[WS]'), 'Received new connection');
		clients.add(ws);

		ws.on('close', () => {
			console.log(red('[WS]'), 'Closed connection');
			clients.delete(ws);
		});
		ws.on('error', (error) => console.error(red('[WS]'), 'Received error:', error));
		ws.on('message', (message) => {
			console.log(gray('>'), italic(magenta(message.toString('utf8'))));
			broadcast(message, ws);
		});
		ws.on('open', () => {
			console.log(green('[WS]'), 'Websocket re-opened connection');
			clients.add(ws);
		});
	});

	function broadcast(message, source) {
		for (const client of clients) {
			if (client === source) continue;
			client.send(message, (error) => {
				if (error) console.error(red('[WS]'), 'Error while sending message:', error);
			});
		}
	}

	return { wss, broadcast };
}

function logPossibleIps(port) {
	const interfaces = networkInterfaces();
	for (const [key, value] of Object.entries(interfaces)) {
		// If the interface is WiFi or Ethernet, print the non-internal IPv4 addresses
		if (key.startsWith('Wi-Fi') || key.startsWith('Ethernet')) {
			for (const { address, internal, family } of value) {
				if (!internal && family === 'IPv4') {
					console.log(`- ${yellow(key)} ${cyan(`${address}:${port}`)}`);
				}
			}
		}
	}
}
