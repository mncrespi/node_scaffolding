import request                  from 'supertest-as-promised'
import httpStatus               from 'http-status'
import chai                     from 'chai'
import { expect, }              from 'chai'
import app                      from '../../index'
import jwt                      from 'jsonwebtoken'
import config                   from '../../config/env'

chai.config.includeStack = true

describe('## User APIs', () => {
	let user = {
    name: 'Matias',
    surname: 'Crespi',
    email: 'mat.cres@gmail.com',
    username: 'mncrespi',
    password: 'MyPass123',
    mobile_number: '1234567890',
	}

  // Create fake token for test protected endPoints
  const token = jwt.sign({}, config.jwt.secret, { expiresIn: config.jwt.expire, })


	describe('# POST /api/users', () => {
		it('should create a new user', (done) => {
			request(app)
				.post('/api/users')
        .set('Authorization', `Bearer ${token}`)
				.send(user)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.username).to.equal(user.username)
					expect(res.body.mobile_number).to.equal(user.mobile_number)
					user = res.body
					done()
				})
		})
	})

	describe('# GET /api/users/:userId', () => {
		it('should get user details', (done) => {
			request(app)
				.get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.username).to.equal(user.username)
					expect(res.body.mobile_number).to.equal(user.mobile_number)
					done()
				})
		})

		it('should report error with message - Not found, when user does not exists', (done) => {
			request(app)
				.get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${token}`)
				.expect(httpStatus.NOT_FOUND)
				.then((res) => {
					expect(res.body.message).to.equal('Not Found')
					done()
				})
		})
	})

	describe('# PUT /api/users/:userId', () => {
		it('should update user details', (done) => {
			user.username = 'matcres'
			request(app)
				.put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
				.send(user)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.username).to.equal('matcres')
					expect(res.body.mobile_number).to.equal(user.mobile_number)
					done()
				})
		})
	})

	describe('# GET /api/users/', () => {
		it('should get all users', (done) => {
			request(app)
				.get('/api/users')
        .set('Authorization', `Bearer ${token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body).to.be.an('array')
					done()
				})
		})
	})

	describe('# DELETE /api/users/', () => {
		it('should delete user', (done) => {
			request(app)
				.delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.username).to.equal('matcres')
					expect(res.body.mobile_number).to.equal(user.mobile_number)
					done()
				})
		})
	})
})
