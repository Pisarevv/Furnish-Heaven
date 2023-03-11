import * as api from "./api"

export const login = (email,password) =>
     api.post("/users/login", {email,password})
