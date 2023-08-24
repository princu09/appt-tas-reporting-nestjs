import { RequestQueryBuilder } from "@nestjsx/crud-request";
import type { Role, RoleDTO, Roleuser } from "@appt-digital/appt-nest-types";
import { GET, POST } from "./http.service";
import { getOrganisationId } from "./organisation.service";

export async function getRoleByTitle(title: string): Promise<Role[]> {
  const qb = RequestQueryBuilder.create();
  const { data } = await GET("role", qb.search({ title }).query());
  return data as Role[];
}

export async function addUserToRole(userId: string, roleId: string) {
  try {
    return (
      await POST(
        "roleuser",
        {},
        {
          owner: userId,
          role: roleId,
          organisation: getOrganisationId(),
        }
      )
    )
  } catch (e) {
    return e;
  }
}

export async function getUsersWithRole(
  id: string
): Promise<Roleuser[] | unknown> {
  try {
    const qb = RequestQueryBuilder.create();
    return (await GET("roleuser", qb.search({ role: id }).query()))
  } catch (e) {
    return e;
  }
}

export async function createRole(
  data: Partial<RoleDTO>
): Promise<Promise<Role> | unknown> {
  try {
    return (await POST("role", {}, data))
  } catch (e) {
    return e;
  }
}
