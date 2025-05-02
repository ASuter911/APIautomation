import { User } from "../../helper/interface"
import { signUp2, deleteFunction, getUser, login, signUp, login2, deleteFunction2 } from "../../helper/user"
import* as supertest from 'supertest'
const request = supertest('http://localhost:8001/api/v1/')

describe('USER SIGNUP AND LOGIN',() => {
    const user:User = getUser('admin')
    let cookie: string;
    describe('POSITIVE TESTING',() => {
        //asyng/await + try and catch
        it('should signup, login and delete the user', async () => {

          
            try {
                //Make the POST request
                const res = await signUp(user)
                expect(res.statusCode).toBe(201)
                expect(res.body.data.user.email).toEqual(user.email)
                expect(res.body.status).toEqual("success")
                //Login
                const loginRes = await login(user)
                expect(loginRes.statusCode).toBe(200)
                expect(loginRes.body.status).toBe("success")
                console.log(loginRes.body)
                cookie = loginRes.headers['set-cookie'][0].split(';')[0]
                //delete
                const deleteRes = await deleteFunction(cookie)
                expect(deleteRes.statusCode).toBe(200)
                expect(deleteRes.body.message).toBe("User deleted successfully")
                //Login
                const loginAfterDelete = await login(user)
                expect(loginAfterDelete.statusCode).toBe(401)
                expect(loginAfterDelete.body.message).toBe("Incorrect email or password")
            } catch (error) {
                    console.error("Error during sign up:", error);
                    throw error;
        }
    })
        it('should signup, login and delete the user using .then()', () => {
        return signUp(user)
            .then((res) => {
                expect(res.statusCode).toBe(201)
                expect(res.body.data.user.email).toEqual(user.email)
                expect(res.body.status).toEqual("success")
                return login(user)
            })
            .then((loginRes) => {
                expect(loginRes.statusCode).toBe(200)
                expect(loginRes.body.status).toBe("success")
                cookie = loginRes.headers['set-cookie'][0].split(';')[0]
                return deleteFunction(cookie)
            })
            .then((deleteRes) => {
                expect(deleteRes.statusCode).toBe(200)
                expect(deleteRes.body.message).toBe("User deleted successfully")
                return login(user)
            })
            .then((loginAfterDelete) => {
                expect(loginAfterDelete.statusCode).toBe(401)
                expect(loginAfterDelete.body.message).toBe("Incorrect email or password")
            })
        })
        it('should signup, login and delete the user using .end(done callback)', (done) => {
            signUp2(user)
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res.statusCode).toBe(201)
                    expect(res.body.data.user.email).toEqual(user.email)
                    expect(res.body.status).toEqual("success")
                    login2(user)
                        .end((err, loginRes) => {
                            if(err) return done(err);
                            expect(loginRes.statusCode).toBe(200)
                            expect(loginRes.body.status).toBe("success")
                            cookie = loginRes.headers['set-cookie'][0].split(';')[0]
                            return deleteFunction2(cookie)
                                .end((err, deleteRes) => {
                                    if(err) return done(err);
                                    expect(deleteRes.statusCode).toBe(200)
                                    expect(deleteRes.body.message).toBe("User deleted successfully")
                                    login2(user)
                                        .end((err, loginAfterDelete) => {
                                            if(err) return done(err);
                                            expect(loginAfterDelete.statusCode).toBe(401)
                                            expect(loginAfterDelete.body.message).toBe("Incorrect email or password")
                                            done()
                                        })
                                })
                        })
                })
               
            })
})


describe('NEGATIVE TESTING', () => {
    it('login with invalid email', async () => {
        try {
            const res = await login(user)
            expect(res.statusCode).toBe(401)
            expect(res.body.status).toEqual("fail")
            expect(res.body.message).toEqual("Incorrect email or password")
        } catch (error) {
            console.error("Error during sign up:", error);
            throw error;
        }
    })
    it('login with invalid password', async () => {
        try {
            const res = await login(user)
            expect(res.statusCode).toBe(401)
            expect(res.body.status).toEqual("fail")
            expect(res.body.message).toEqual("Incorrect email or password")
        } catch (error) {
            console.error("Error during sign up:", error);
            throw error;
        }
    })
    it("all required fields are missing", async () => {
        const invalidUser: User = { name: "", email: "", password: "", passwordConfirm: "" };
        const res = await signUp(invalidUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Missing required fields: name, email, password, passwordConfirm");
    });
    it("the password is too long", async () => {
        const res = await signUp({ name: "userData.name", email: "userData.email", password: "longPassword", passwordConfirm: "longPassword" });
        const longPassword = "a".repeat(101);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Password longer then 30 characters");
      });
})
})