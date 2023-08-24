// import {describe, expect, test} from '@jest/globals';
// import { RoleDTO } from 'appt-nest';
// import { login } from '../authentication';
// import { resetDB } from '../testing/db';
// import { addUserToRole, createRole, getRoleByTitle, getUsersWithRole } from './role.service';
// import { createAdminUser,  getUser, getUsers } from './user.service';
// import {createPortalUser} from "../authentication";
//
// describe('User', () => {
//   jest.setTimeout(10000000)
//   let token = ''
//   let userId = ''
//   let roleId = '2b190df0-7548-481b-afe1-73a5133abcfb'
//
// 	beforeAll(async () => {
// 		try {
// 			await resetDB()
// 			let loginData = await login('test@appt.digital', '100%Safe')
// 			token = loginData.token
// 			userId = loginData.user.id
// 		} catch (err) {
// 			throw new Error()
// 		}
// 	})
//
// 	it('Get user', async () => {
// 		try {
// 			let user = await getUser(userId)
// 			expect(user.id).toBe(userId)
// 		} catch(err) {
// 			console.log(err)
// 			throw new Error()
// 		}
// 	})
//
// 	it('Get user', async () => {
// 		expect.assertions(1)
// 		try {
// 			let user = await getUser('fb71faca-a689-4019-95c5-b68043ea4743')
// 			expect(user).toBe(null)
// 		} catch(err: any) {
// 			expect(err.response.status).toBe(404)
// 		}
// 	})
//
// 	it('Gets users', async () => {
// 		let users = await getUsers(null)
// 		expect(users?.length).toBe(1)
// 	})
//
// 	it('Create user', async () => {
// 		try {
// 			let ret = await createPortalUser({
// 				email: 'test@appt.digital',
// 				username: 'test@appt.digital',
// 			})
// 			expect(ret.email).toBe('test@appt.digital')
// 		} catch (err) {
// 			throw new Error()
// 		}
// 	})
//
// 	it('Create admin user', async () => {
// 		try {
// 			let ret = await createAdminUser({
// 				email: 'test2@appt.digital',
// 				username: 'test2@appt.digital',
// 			})
// 			expect(ret.email).toBe('test2@appt.digital')
// 			let role = await getRoleByTitle('Admin')
// 			let users = await getUsersWithRole(role[0].id)
// 			expect(users.find(x => x.owner = ret.id)).not.toBe(null)
// 		} catch (err) {
// 			console.log(err)
// 			throw new Error()
// 		}
// 	})
//
//
// ////	export async function createAdminUser(user: UserDTO): Promise<User> {
// ////		user.type = 'admin'
// ////		let role = await getRoleByTitle('Admin')
// ////		let newUser = (await POST('/user/admin', {}, user)).data as User
// ////		await addUserToRole(newUser.id, role[0].id)
// ////		return newUser
// ////	}
// ////
// ////	export async function createKPIUser(user: UserDTO) {
// ////		return await createAdminUser(user)
// ////	}
//
//
// });
