 const supertest = require('supertest')

 global.request = supertest('http://localhost:8001/api/v1')

 