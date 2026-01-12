from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
from typing import Optional

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginEventIn(BaseModel):
    email: EmailStr
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None

def get_client_ip(request: Request) -> Optional[str]:
    # If behind a proxy, X-Forwarded-For may contain "client, proxy1, proxy2"
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("/login-event")
def login_event(payload: LoginEventIn, request: Request):
    """
    Updates public.user_profiles and inserts into public.login_events.
    Uses supabase ADMIN client (service role) so it can write regardless of RLS.
    """
    # Import here so it uses your existing initialized client (keep consistent with your project)
    try:
        from db.supabase_admin import supabase_admin  # <- you will create this in Step 4B (next)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase admin client not configured: {e}")

    ip = get_client_ip(request)
    now = datetime.now(timezone.utc).isoformat()

    email = payload.email.lower().strip()

    # 1) Upsert user_profiles (create row if missing, else update)
    # We update geo fields only if provided (frontend can send them), otherwise keep existing.
    update_fields = {
        "email": email,
        "last_login_at": now,
    }
    # Only set geo if passed
    if payload.country is not None: update_fields["country"] = payload.country
    if payload.region is not None: update_fields["region"] = payload.region
    if payload.city is not None: update_fields["city"] = payload.city

    # Upsert by email (make sure user_profiles has UNIQUE(email) or this will duplicate)
    # If you don’t have unique(email), tell me and we’ll add it.
    res_upsert = supabase_admin.table("user_profiles").upsert(
        update_fields,
        on_conflict="email"
    ).execute()

    if getattr(res_upsert, "error", None):
        raise HTTPException(status_code=500, detail=str(res_upsert.error))

    # 2) Increment login_count (Supabase upsert doesn't do atomic increment easily in one call)
    # We do a select -> update to increment.
    res_sel = supabase_admin.table("user_profiles").select("login_count").eq("email", email).limit(1).execute()
    if getattr(res_sel, "error", None):
        raise HTTPException(status_code=500, detail=str(res_sel.error))

    current = 0
    if res_sel.data and len(res_sel.data) > 0 and res_sel.data[0].get("login_count") is not None:
        current = int(res_sel.data[0]["login_count"])

    res_update = supabase_admin.table("user_profiles").update({
        "login_count": current + 1,
        "last_login_at": now,
    }).eq("email", email).execute()

    if getattr(res_update, "error", None):
        raise HTTPException(status_code=500, detail=str(res_update.error))

    # 3) Insert login_events row
    # Adjust column names here if your login_events uses different columns.
    res_event = supabase_admin.table("login_events").insert({
        "email": email,
        "ip": ip,
        "created_at": now,
        "country": payload.country,
        "region": payload.region,
        "city": payload.city,
    }).execute()

    if getattr(res_event, "error", None):
        raise HTTPException(status_code=500, detail=str(res_event.error))

    return {"ok": True, "email": email, "ip": ip}