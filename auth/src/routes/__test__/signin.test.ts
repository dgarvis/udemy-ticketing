import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
	.post('/api/users/signin')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(201);
    
    const resp = await request(app)
	.post('/api/users/signin')
	.send({
	    email: 'test@test.com',
	    password: 'badPassword'
	})
	.expect(400);
});

it('response with a cookie on valid login', async () => {
    await request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(201);
    
    const resp = await request(app)
	.post('/api/users/signin')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(200);

    expect(resp.get('Set-Cookie')).toBeDefined();    
});

