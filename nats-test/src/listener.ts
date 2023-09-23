import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId,  {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to nats');

    stan.on('close', () => {
	console.log('NATS connection closed!');
	process.exit();
    });
    
    const options = stan.subscriptionOptions()
	.setManualAckMode(true)
	.setDeliverAllAvailable()
	.setDurableName('listening-srv');
    // subscribe to the channel, with a queue group for the service. (queue group is optinal)
    const sub = stan.subscribe('ticket:created', 'listener-service-queue-group', options);

    sub.on('message', (msg: Message) => {
	const data = msg.getData();

	if (typeof data === 'string') {
	    console.log(`Recv event #${msg.getSequence()}, with data: ${data}`);
	}

	msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    private client: Stan;

    constructor(client: Stan) {
	this.client = client;
    }
}
