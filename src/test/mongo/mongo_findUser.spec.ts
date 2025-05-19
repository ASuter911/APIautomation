import { getUser, signUp } from "../../../helper/user";
const { MongoClient, Db, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

describe('NOMGODB connection', () => {
    let connection: typeof MongoClient
    let db: typeof Db
    beforeAll(async () => {
        try {
            connection = await MongoClient.connect(process.env.DATABASE_URL as string, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            db = await connection.db()
            console.log(process.env.DATABASE_URL, 'connection')
        } catch (error) {
            console.error('Error connecting to MongoDB:', error)
        }
    })
    afterAll(async () => {
        await connection.close()
    })
    it('Connect to the collection and find user', async () => {
        const users = db.collection('users')
        console.log(users, 'users')
        //Retrieve the documents in the collection
        const user = await users.findOne({ name: 'Yesenia' })
        console.log(user, 'user')
    })
    it('Create new user with imported data', async () => {
        const userImport = getUser("admin");
        console.log(userImport, "userImport");
        try {
            const res = await signUp(userImport);
            expect(res.statusCode).toBe(201);
            console.log(res.body)
            const users = db.collection("users");
            const userData = await users.findOne({name:userImport.name})
            console.log(userData, "userData");
            if(!userData){
                throw new Error("User not found in the database");
            }
            expect(userData.name).toEqual(userImport.name);
            expect(userData.email).toEqual(userImport.email.toLowerCase());
            expect(userData.role).toBe('admin')
            expect(userData._id.toString()).toEqual(res.body.data.user._id);
            let deleteData = await users.deleteOne({
                _id:new ObjectId(userData._id)
            })
            console.log(deleteData, "deleteData");
            let findUser = await users.findOne({_id: userData._id})
            console.log(findUser, "findUser");
            expect(findUser).toBe(null);
            expect(findUser).toBeNull()
        } catch (error) {
            console.error("Error creating user:", error);
            throw error; // Rethrow the error to fail the test
        }
      })
    });


