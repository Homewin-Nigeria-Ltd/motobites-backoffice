import { loginAction } from "../actions/login.action"
import { logoutAction } from "../actions/logout.action"
import type { LoginPayload } from "../schemas/login.schema"

export const authMutations = {
  login: {
    mutationFn: (data: LoginPayload) => loginAction(data),
  },
  logout: {
    mutationFn: () => logoutAction(),
  },
}
