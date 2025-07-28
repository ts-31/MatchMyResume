from fastapi import Request, HTTPException
from jose import jwt
import requests

CLERK_ISSUER = "https://upward-squirrel-88.clerk.accounts.dev"
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

_jwks_cache = None


def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        print("🌐 Fetching Clerk JWKS")
        resp = requests.get(CLERK_JWKS_URL)
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache


def get_user_info_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    print("🔐 Received Authorization header:", auth_header)

    if not auth_header or not auth_header.startswith("Bearer "):
        print("❌ Missing or invalid Authorization header")
        raise HTTPException(status_code=401, detail="Missing or invalid auth token")

    token = auth_header.replace("Bearer ", "")

    try:
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]
        print("🧩 JWT Header:", headers)

        jwks = get_jwks()
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)

        if key is None:
            print("❌ Public key not found for kid:", kid)
            raise HTTPException(status_code=401, detail="Invalid token (kid)")

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={"verify_aud": False}, 
        )

        print("✅ JWT Payload:", payload)

        user_id = payload.get("sub")
        email = payload.get("primaryEmail")

        if not user_id:
            raise HTTPException(status_code=401, detail="Token missing sub (user id)")

        return user_id, email

    except jwt.ExpiredSignatureError:
        print("❌ Token expired")
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        print("❌ Token decode error:", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")
