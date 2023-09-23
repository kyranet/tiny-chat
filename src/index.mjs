import { defineCommand, runMain } from 'citty';
import { createClient } from './client.mjs';
import { createInputReader } from './reader.mjs';
import { createServer } from './server.mjs';

const main = defineCommand({
	meta: {
		name: 'tiny-chat',
		version: '1.0.0',
		description: 'A tiny chat server powered with WebSockets'
	},
	subCommands: {
		server: {
			meta: {
				description: 'Start a chat server'
			},
			args: {
				port: {
					valueHint: '8080',
					description: 'The port to listen on'
				}
			},
			run({ args }) {
				const { wss, broadcast } = createServer(args.port && Number(args.port));
				createInputReader(broadcast, wss);
			}
		},
		client: {
			meta: {
				description: 'Start a chat client'
			},
			args: {
				port: {
					valueHint: '8080',
					description: 'The IP address of the server'
				},
				ip: {
					valueHint: '127.0.0.1',
					description: 'The port to connect to',
					required: true
				}
			},
			run({ args }) {
				const { ws, send } = createClient(args.ip, args.port && Number(args.port));
				createInputReader(send, ws);
			}
		}
	},
	run() {
		console.log('Greetings!');
	}
});

runMain(main);
