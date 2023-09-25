import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
	.put(`/api/tickets/${id}`)
	.set('Cookie', global.signin())
	.send({
	    title: 'title',
	    price: 20
	})
	.expect(404);
});

it('returs a 401 if the user is not authenticated', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
	.put(`/api/tickets/${id}`)
	.send({
	    title: 'title',
	    price: 20
	})
	.expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const resp = await request(app)
	.post('/api/tickets')
	.set('Cookie', global.signin())
	.send({
	    title: "a title",
	    price: 20
	});

    await request(app)
	.put(`/api/tickets/${resp.body.id}`)
	.set('Cookie', global.signin())
	.send({
	    title: 'updated',
	    price: 1000
	})
	.expect(401);
});

it('returns a 400 if the user provides an invalid title or price.', async () => {
    const cookie = global.signin();
    
    const resp = await request(app)
	.post('/api/tickets')
	.set('Cookie', cookie)
	.send({
	    title: "a title",
	    price: 20
	});
    
    await request(app)
	.put(`/api/tickets/${resp.body.id}`)
	.set('Cookie', cookie)
	.send({
	    title: '',
	    price: 20
	})
	.expect(400);
    
    await request(app)
	.put(`/api/tickets/${resp.body.id}`)
	.set('Cookie', cookie)
	.send({
	    title: 'a title',
	    price: -20
	})
	.expect(400);
});

it('updaets the ticket provided valid inputs', async () => {
    const cookie = global.signin();
    
    const resp = await request(app)
	.post('/api/tickets')
	.set('Cookie', cookie)
	.send({
	    title: "a title",
	    price: 20
	});

    const title = 'updated';
    const price = 50;
    
    await request(app)
	.put(`/api/tickets/${resp.body.id}`)
	.set('Cookie', cookie)
	.send({
	    title, price
	})
	.expect(200);

    const ticketResp = await request(app)
	.get(`/api/tickets/${resp.body.id}`)
	.send();
    const ticket = ticketResp.body;

    expect(ticket.title).toEqual(title);
    expect(ticket.price).toEqual(price);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    
    const resp = await request(app)
	.post('/api/tickets')
	.set('Cookie', cookie)
	.send({
	    title: "a title",
	    price: 20
	});

    const title = 'updated';
    const price = 50;
    
    await request(app)
	.put(`/api/tickets/${resp.body.id}`)
	.set('Cookie', cookie)
	.send({
	    title, price
	})
	.expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
