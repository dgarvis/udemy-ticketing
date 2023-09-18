import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(201);
});

it('returns a 400 with an invalid emaill signup', async () => {
    return request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test',
	    password: 'password'
	})
	.expect(400);
});

it('returns a 400 with an invalid password signup', async () => {
    return request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test',
	    password: 'p'
	})
	.expect(400);
});

it('returns a 400 with missing email and password', async () => {
    return request(app)
	.post('/api/users/signup')
	.send({
	})
	.expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(201);
    
    await request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(400);
});

it('sets a cookie after successful signup', async () => {
    const resp = await request(app)
	.post('/api/users/signup')
	.send({
	    email: 'test@test.com',
	    password: 'password'
	})
	.expect(201);

    expect(resp.get('Set-Cookie')).toBeDefined();
});
