import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
    const cookie = await signin();
    
    const resp = await request(app)
	.post('/api/users/signout')
    	.set('Cookie', cookie)
	.send({})
	.expect(200);

    expect(resp.get('Set-Cookie')).toBeDefined();
});
