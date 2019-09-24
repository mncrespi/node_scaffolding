import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import { expect, } from 'chai'
import app from '../../index.js'
import jwt from 'jsonwebtoken'
import config from '../../config/env/index.js'

chai.config.includeStack = true

describe('## Misc', () => {
  // Create fake token for test protected endPoints
  const token = jwt.sign({}, config.jwt.secret, { expiresIn: config.jwt.expire, })


  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch((e) => done(new Error(e)))
    })
  })

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/users/56z787zzz67fc')
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.status).to.equal(404)
          done()
        })
        .catch((e) => done(new Error(e)))
    })

    it('should handle express validation error - username is required', (done) => {
      request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mobileNumber: '1234567890',
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.status).to.equal(400)
          done()
        })
        .catch((e) => done(new Error(e)))
    })
  })
})
