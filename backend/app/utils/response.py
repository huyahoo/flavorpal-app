def success(data=None, msg="Success", code=200):
    return {
        "code": code,
        "data": data,
        "msg": msg
    }


def error(msg="Error", code=400):
    return {
        "code": code,
        "data": None,
        "msg": msg
    }

def not_found(msg="Not found", code=404):
    return {
        "code": code,
        "data": None,
        "msg": msg
    }