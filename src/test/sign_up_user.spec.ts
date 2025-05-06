import *as supertest from 'supertest';// Import supertest
import { faker } from "@faker-js/faker"; // Import faker
const request = supertest('http://localhost:8001/api/v1/'); // Replace with your server URL
import { Response } from 'supertest';
interface UserData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}


describe('user sign up', () => {
    describe('POSITIVE TESTING with async/await', () => {
        it('should sign up a new user', async () => {
            const userData:UserData = {
                "name": faker.person.fullName(),
                "email": faker.internet.email(),
                "password": "test1234",
                "passwordConfirm": "test1234",
            }
            console.log(userData)
            try {
                //Make the POST request
                const res:Response = await request.post('users/signup').send(userData).expect(201)
                //Log the response
                console.log(res.body)
                //Validate response body
                expect(res.body.status).toBe("success");
                expect(res.body.data.user.name).toBe(userData.name);
                expect(typeof res.body.data.user.name).toBe("string");
                expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
                expect(typeof res.body.data.user.email).toBe("string");
                expect(res.body.token).toBeDefined();
                expect(typeof res.body.token).toBe("string");

                // Additional checks for user object
                expect(res.body.data.user).toHaveProperty("_id");
                expect(res.body.data.user).not.toHaveProperty("password");
            } catch (error) {
                console.error("Error during sign up:", error);
                throw error; // Rethrow the error to fail the test

            }
        })
    })
    describe('POSITIVE TESTING with .then', () => {
                it('should sign up a new user', async () => {
                const userData:UserData = {
                    "name": faker.person.fullName(),
                    "email": faker.internet.email(),
                    "password": "test1234",
                    "passwordConfirm": "test1234",
                }
                //Make the POST request using .then
                return request.post('users/signup').send(userData).expect(201).then((res:Response) => {
                    //Validate response body
                    expect(res.body.status).toBe("success");
                    expect(res.body.data.user.name).toBe(userData.name);
                    expect(typeof res.body.data.user.name).toBe("string");
                    expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
                    expect(typeof res.body.data.user.email).toBe("string");
                    expect(res.body.token).toBeDefined();
                    expect(typeof res.body.token).toBe("string");

                    // Additional checks for user object
                    expect(res.body.data.user).toHaveProperty("_id");
                    expect(res.body.data.user).not.toHaveProperty("password");
                })
                    .catch((error) => {
                        console.error("Error during sign up:", error);
                        throw error; // Rethrow the error to fail the test
                    })
            })
        })
    describe('POSITIVE TESTING with .end () and done ()', () => {
                it('should sign up a new user', (done) => {
                    const userData = {
                        "name": faker.person.fullName(),
                        "email": faker.internet.email(),
                        "password": "test1234",
                        "passwordConfirm": "test1234",
                    }
                    //Make the POST request using .then
                    request.post('users/signup').send(userData).expect(201).end((err:Error | null, res:Response) => {
                        if (err) {
                            console.error("Error during sign up:", err);
                            return done(err); // Call done with the error if it exists
                        }
                        try {
                            expect(res.body.status).toBe("success");
                            expect(res.body.data.user.name).toBe(userData.name);
                            expect(typeof res.body.data.user.name).toBe("string");
                            expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
                            expect(typeof res.body.data.user.email).toBe("string");
                            expect(res.body.token).toBeDefined();
                            expect(typeof res.body.token).toBe("string");

                            // Additional checks for user object
                            expect(res.body.data.user).toHaveProperty("_id");
                            expect(res.body.data.user).not.toHaveProperty("password");
                            done(); // Call done to indicate the test is complete
                        }
                        catch (err) {
                            console.error("Error during sign up:", err);
                            done (err); // Rethrow the error to fail the test
                        }
                    })
                })
            })
            describe('NEGATIVE TESTING', () => {
                it('should sign up a new user', async () => {
                    const userData = {
                        "name": "John Doe",
                        "email": "john6@example.com",
                        "password": "mypassword123",
                        "passwordConfirm": "mypassword123"
                    }
                    console.log(userData)
                    const res = await request.post('users/signup').send(userData)
                    console.log(res.body.message)
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe('Missing required fields: name')
                })
            })
            it("should sign up a new user, name is missing", async () => {
                const userData = {
                  email: "john9@example.com",
                  password: "mypassword123",
                  passwordConfirm: "mypassword123",
                };
                console.log(userData);
                const res = await request.post("/users/signup").send(userData);
                console.log(res.body.message);
                console.log(res.body);
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Missing required fields: name");
            });

            
            it('should sign up a new user, email is missing', async () => {
                const userData = {
                    "name": "John Doe",
                    "password": "mypassword123",
                    "passwordConfirm": "mypassword123"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Missing required fields: email')
            })
            it('should sign up a new user, password is missing', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "john@example.com",
                    "passwordConfirm": "mypassword123"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Missing required fields: password')
            })
            it('should sign up a new user, passwordConfirm is missing', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "john@example.com",
                    "password": "mypassword123",
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Missing required fields: passwordConfirm')
            })
            it('should sign up a new user, email and password are missing', async () => {
                const userData = {
                    "name": "John Doe",
                    "passwordConfirm": "mypassword123"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Missing required fields: email, password')
            })
            it('should sign up a new user, email is invalid', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "john9@examplecom",
                    "password": "mypassword123",
                    "passwordConfirm": "mypassword123"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('User validation failed: email: Please provide a valid email')
            })
            it('should sign up a new user, passwordConfirm does not match password', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "john9@example.com",
                    "password": "mypassword123",
                    "passwordConfirm": "mypassword1234"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('User validation failed: passwordConfirm: Passwords are not the same!')
            })
            it('should sign up a new user, password is longer than 30 characters', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "john9@example.com",
                    "password": "mypassword123mypassword123mypassword123mypassword123",
                    "passwordConfirm": "mypassword123mypassword123mypassword123mypassword123"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Password longer then 30 characters')
            })
            it('should sign up a new user, to create a user with an already used email', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "john@example.com",
                    "password": "mypassword123",
                    "passwordConfirm": "mypassword123"
                }
                console.log(userData)
                const res = await request.post('users/signup').send(userData)
                console.log(res.body.message)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('This email is already in use. Please use another email.')
            })
        })
    
        describe('NEGATIVE TESTING', () => {
            it.only('name is missing with .end () and done ()', (done) => {
                const userData = {
                    "email": faker.internet.email(),
                    "password": "test1234",
                    "passwordConfirm": "test1234",
                }
                console.log(userData)
                //Make the POST request using .then
                request.post('users/signup').send(userData).expect(400).end((err:Error | null, res:Response) => {
                    if (err) {
                        console.error("Error during sign up:", err);
                        return done(err); // Call done with the error if it exists
                    }
                    try {
                        expect(res.body.status).toBe("fail");
                        expect(res.body.message).toContain('Missing required fields: name')

                        done(); // Call done to indicate the test is complete
                    }
                    catch (err) {
                        console.error("Error during sign up:", err);
                        done (err); // Rethrow the error to fail the test
                    }
                })
            })
            it('name is missing with .than', async () => {
                const userData = {
                    "email": faker.internet.email(),
                    "password": "test1234",
                    "passwordConfirm": "test1234",
                }
                  return request.post("users/signup").send(userData).expect(400).then((res: Response) => {
                    expect(res.body.status).toBe("fail");
                    expect(res.body.message).toBe('Missing required fields: name');
                    });
                });
            });
