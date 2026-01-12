from fastapi import APIRouter, Request, HTTPException
from supabase import create_client
import requests
from typing import Optional
import os

router = APIRouter()

# SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
# SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")

SUPABASE_ANON_KEY = (
    os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("SUPABASE_PUBLISHABLE_KEY")  # ✅ your env uses this name
    or os.getenv("VITE_SUPABASE_ANON_KEY")
)

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("Missing Supabase env vars: need SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_PUBLISHABLE_KEY).")

supabase_auth = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# supabase_auth = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def get_client_ip(request: Request):
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0]
    return request.client.host if request.client else None


def geo_from_ip(ip: Optional[str]):
    if not ip:
        return None
    try:
        r = requests.get(f"https://ipapi.co/{ip}/json/", timeout=3)
        if r.status_code != 200:
            return {"ip": ip}
        j = r.json()
        return {
            "ip": ip,
            "city": j.get("city"),
            "region": j.get("region"),
            "country": j.get("country_name"),
            "country_code": j.get("country_code"),
            "latitude": j.get("latitude"),
            "longitude": j.get("longitude"),
            "org": j.get("org"),
        }
    except Exception:
        return {"ip": ip}


@router.post("/auth/log-login")
async def log_login(request: Request):
    body = await request.json()
    access_token = body.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Missing access_token")

    # Verify user
    user_res = supabase_auth.auth.get_user(access_token)
    if not user_res or not user_res.user:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = user_res.user
    email = user.email

    ip = get_client_ip(request)
    geo = geo_from_ip(ip)

    supabase_admin.table("login_events").insert({
        "user_id": user.id,
        "email": email,
        "ip": ip,
        "geo": geo
    }).execute()

    return {"ok": True}