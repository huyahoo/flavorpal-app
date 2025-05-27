export const getCommonError = (errorMsg: string, errorCode: number = 500) => {
  return {
    code: errorCode,
    data: null,
    msg: errorMsg,
  }
}

export const getCommonSuccess = (data: object, msg: string = "Success", code = 200) => {
  return {
    code,
    data,
    msg,
  }
}