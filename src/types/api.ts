type ErrorReturn = {
  status: "Error",
  message: string
}
type SuccessReturn = {
  status: "Success",
  speed: number
  movement: number
}

export type ResponseType = ErrorReturn | SuccessReturn