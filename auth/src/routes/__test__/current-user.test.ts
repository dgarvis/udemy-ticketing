import request from 'supertest';
import { app } from '../../app';

it('responses with details of current user', async () => {
    const cookie = await signin();

    const resp = await request(app)
	.get('/api/users/currentuser')
	.set('Cookie', cookie)
	.send()
	.expect(200);

    expect(resp.body.currentUser.email).toEqual('test@test.com');
});

it('response with null when not signed in', async() => {
    const resp = await request(app)
	.get('/api/users/currentuser')
	.send()
	.expect(200);

    expect(resp.body.currentUser).toEqual(null);
});
