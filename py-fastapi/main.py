from typing import Annotated

import jwt
from fastapi import FastAPI, Header

DJAODJIN_SECRET_KEY = "**key downloaded from Rules dashboard**"
JWT_ALGORITHM = 'HS256'

app = FastAPI()


@app.get("/")
def read_root(authorization: Annotated[str | None, Header()] = None):
    session_key = None
    session_data = {}
    if authorization:
        jwt_values = authorization.split(' ')
        if (len(jwt_values) > 1 and
            jwt_values[0].lower() == 'bearer'):
            session_key = jwt_values[1]
    if session_key:
        try:
            session_data = jwt.decode(
                session_key,
                DJAODJIN_SECRET_KEY,
                algorithms=[JWT_ALGORITHM])
        except jwt.exceptions.PyJWTError:
            pass
    return session_data
