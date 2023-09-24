import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    stan.on('close', () => {
	console.log('NATS connection closed!');
	process.exit();
    });

    const pub = new TicketCreatedPublisher(stan);
    await pub.publish({
	id: '123',
	title: 'a title',
	price: 20
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
