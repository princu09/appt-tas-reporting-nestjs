import {describe, expect, test} from '@jest/globals';
import { RoleDTO } from 'appt-nest';
import { login } from '../authentication';
import { resetDB } from '../testing/db';
import { addUserToRole, createRole, getRoleByTitle, getUsersWithRole } from './role.service';


describe('Role', () => {
  jest.setTimeout(10000000)
  let token = ''
  let userId = ''
  let roleId = '2b190df0-7548-481b-afe1-73a5133abcfb'

  beforeAll(async () => {
    try {
      await resetDB()
      let loginData = await login('test@appt.digital', '100%Safe')
      token = loginData.token
      userId = loginData.user.id
    } catch (err) {
      console.log(err)
    }
  })

  test('Get Role by title', async () => {
    try {
      let role = await getRoleByTitle('Admin')
      expect(role?.length).toBe(1)
      expect(role.at(0)?.title).toEqual('Admin')
    } catch (err) {
      console.log(err)
    }
  });

  test('Get Role by title None', async () => {
    try {
      let role = await getRoleByTitle('jhadhuas')
      expect(role?.length).toBe(0)
    } catch (err) {
      console.log(err)
    }
  });

  test('Get Users With Role', async () => {
    try {
      let role = await getRoleByTitle('Admin')
      let ret = await getUsersWithRole(role[0].id)
      expect(ret)
    } catch (err: any) {
      throw new Error(err);
    }
  })

  test('Add user to role', async () => {
    try {
      await addUserToRole(userId, roleId)
      let ret = await getUsersWithRole(roleId)
      expect(ret.length).toBe(11)
      expect(ret[0].role).toBe(roleId)
      expect(ret[0].owner).toBe(userId)
    } catch (err: any) {
      throw new Error(err);
    }
  })

  test('Create role', async () => {
    try {
      let data = await createRole({
        title: 'Our test role'
      })
      expect(data.title).toEqual('Our test role')
    } catch (err: any) {
      throw new Error(err);
    }
  })
});