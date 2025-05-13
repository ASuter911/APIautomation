
   /* beforeAll(() => {console.log('test1');})// 
    afterAll(() => {console.log('test2');})
    it('test 3', () => {
        console.log('test3');
    })*/
import {deleteFunction, getUser, login, signUp} from "../../helper/user";
import {User} from "../../helper/interface";
let user: User;
let cookie: string;
import * as supertest from 'supertest';

const request = supertest('http://localhost:8001/api/v1/')
describe('USER UPDATE - users/updateMe', () => {
    beforeAll(async() => {
        user = getUser('admin');

        const signUpRes = await signUp(user)
        expect(signUpRes.statusCode).toBe(201)

        const loginRes = await login(user)
        expect(loginRes.statusCode).toBe(200)
        cookie = loginRes.headers['set-cookie'][0].split(';')[0];
        console.log('User was created')
    })

    afterAll(async() => {
        await deleteFunction(cookie).then((res) => {
            expect(res.statusCode).toBe(200)
        })
        console.log('User was deleted')
    })

    it('Should update the user and email', async () => {
        const res = await request
            .patch('users/updateMe')
            .set('Cookie', cookie)
            .send({
                name: "John Doe"
            })
        expect(res.statusCode).toBe(200)
    })

    it('Should update the user and photo', async () => {
        const resPhoto = await request
            .patch('users/updateMe')
            .set('Cookie', cookie)
            .attach('photo', 'helper/data/pasv_480.png')
        expect(resPhoto.statusCode).toBe(200)
    })
    it('Should update the password', async () => {
        const res = await request
            .patch('users/updateMe')
            .set('Cookie', cookie)
            .send({
                password: "alluneedIsLove",
            })
        expect(res.statusCode).toBe(400)
    })

    it('Successfully update user name and email', async () => {
        const res = await request
            .patch('users/updateMe')
            .set('Cookie', cookie)
            .send({
                name:"Michael PASV",
	            email:user.email
            })
        expect(res.statusCode).toBe(200)
    })
    it('Should not update the user with invalid email', async () => {
        const res = await request
            .patch('users/updateMe')
            .set('Cookie', cookie)
            .send({
                email:"Micha_911gmailcom"
            })
        expect(res.statusCode).toBe(500)
    })
    it('Should not update the user without token', async () => {
        const res = await request
            .patch('users/updateMe')
            .send({
                name:"Michael PASV"
            })
        expect(res.statusCode).toBe(401)
    })
    it('Should not update the user with invalid token', async () => {
        const res = await request
            .patch('users/updateMe')
            .set('Cookie', 'invalidtoken')
            .send({
                name:"Michael PASV"
            })
        expect(res.statusCode).toBe(401)
    })
})