import request                  from 'supertest-as-promised'
import httpStatus               from 'http-status'
import chai                     from 'chai'
import { expect, }              from 'chai'
import app                      from '../../index'
import config                   from '../../config/env'

chai.config.includeStack = true

describe('## Authorization', () => {
  // You need to have a test user created
  describe('# Authorized', () => {
    it('should return 200 status and JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          username: 'test',
          password: 'MyPass123',
        })
        .expect(httpStatus.OK)
        .then((res) => {
          const reg = new RegExp('^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$', 'g')
          const matchJWT = (reg.exec(res.body.token)) ? true : false // eslint-disable-line no-unneeded-ternary
          expect(res.status).to.equal(200)
          expect(true).to.equal(matchJWT)
          expect(res.body.token_type).to.equal('Bearer')
          expect(res.body.expires_in).to.equal(config.jwt.expire)
          done()
        })
    })
  })

	describe('# Error Handling', () => {
    it('should handle express JWT validation error - Error 401', (done) => {
      request(app)
        .get('/api/users')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.status).to.equal(401)
          done()
        })
    })
	})
})
