import { loginAction } from "../actions/login.action"
import { logoutAction } from "../actions/logout.action"
import type { LoginInput } from "../schemas/login.schema"

export const authMutations = {
  login: {
    mutationFn: (data: LoginInput) => loginAction(data),
  },
  logout: {
    mutationFn: () => logoutAction(),
  },
}
