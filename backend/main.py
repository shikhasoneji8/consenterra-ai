import os
from dotenv import load_dotenv

# ✅ MUST be before importing anything that reads env vars
load_dotenv()

from fastapi import FastAPI, Response, Body
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.supabase_client import supabase_auth
from db.supabase_admin import supabase_admin
from routes.login_event import router as login_event_router
import os
from fastapi import Body
from dotenv import load_dotenv
from pathlib import Path
from policy_pipeline import annotate_policy
from privbert_infer import load_model, predict
from routes.auth import router as auth_router
from fastapi import HTTPException, Request
from typing import Optional, Dict, Any, Tuple
from uuid import uuid4
from datetime import datetime, timezone
from db.usage import increment_prixplainer_usage

# If you already have these, don't duplicate:
# from db.supabase_admin import supabase_admin
# from db.supabase_client import supabase_auth  (or whatever you named it)

FREE_PRIXPLAINER_TRIES = 2



# Load backend/.env explicitly
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Optional: quick sanity check
print("SUPABASE_URL =", os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL"))
print("SUPABASE_ANON_KEY exists?", bool(os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")))

app = FastAPI()
app.include_router(login_event_router)
# Load model once at startup
MODEL_INFO = load_model()
print("Loaded PrivBERT:", MODEL_INFO)

app.include_router(auth_router, prefix="/api")

# def get_bearer_token(request: Request) -> Optional[str]:
#     auth = request.headers.get("authorization") or request.headers.get("Authorization")
#     if not auth:
#         return None
#     parts = auth.split(" ")
#     if len(parts) == 2 and parts[0].lower() == "bearer":
#         return parts[1]
#     return None

def get_client_ip(request) -> Optional[str]:
    # Works in production behind proxies too
    xff = request.headers.get("x-forwarded-for")
    if xff:
        # first IP in the list is original client
        return xff.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    if request.client:
        return request.client.host
    return None

def geo_from_ip(ip: Optional[str]) -> Dict[str, Optional[str]]:
    # local IPs won’t resolve
    if not ip or ip in ("127.0.0.1", "::1"):
        return {"country": None, "region": None, "city": None}

    try:
        # ipapi.co is simple and free for basic usage
        r = requests.get(f"https://ipapi.co/{ip}/json/", timeout=4)
        if r.status_code != 200:
            return {"country": None, "region": None, "city": None}
        j = r.json()
        return {
            "country": j.get("country_name"),
            "region": j.get("region"),
            "city": j.get("city"),
        }
    except Exception:
        return {"country": None, "region": None, "city": None}
    
    
def get_bearer_token(request: Request) -> Optional[str]:
    auth = request.headers.get("authorization") or request.headers.get("Authorization")
    if not auth:
        return None
    parts = auth.split(" ")
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None

def ensure_user_profile(email: str, request: Request) -> Tuple[str, str]:
    """
    Guarantees a row in public.user_profiles for this email.
    Returns (user_id, email).

    - If row exists: return it
    - Else: try to copy from `profiles` if possible
    - Else: create fresh user_profiles row with a generated uuid
    """

    # 1) If user_profiles already has it, use it
    existing = (
        supabase_admin
        .table("user_profiles")
        .select("user_id,email")
        .eq("email", email)
        .execute()
    )
    if getattr(existing, "error", None):
        raise HTTPException(status_code=500, detail=f"user_profiles SELECT error: {existing.error}")

    if existing.data:
        return existing.data[0]["user_id"], existing.data[0]["email"]

    # 2) Try to infer a stable user_id from Supabase auth token (best)
    user_id = None
    token = get_bearer_token(request)
    if token:
        try:
            # supabase-py supports: supabase.auth.get_user(jwt)
            auth_user = supabase_auth.auth.get_user(token)
            # Depending on your supabase-py version:
            # auth_user.user.id or auth_user.data.user.id
            u = getattr(auth_user, "user", None) or getattr(getattr(auth_user, "data", None), "user", None)
            if u and getattr(u, "id", None):
                user_id = u.id
        except Exception:
            # don't hard-fail; we'll fallback
            pass

    # 3) If still no user_id, generate one (not ideal, but keeps system working)
    if not user_id:
        user_id = str(uuid4())

    # 4) Insert into user_profiles
    ins = (
        supabase_admin
        .table("user_profiles")
        .insert({
            "user_id": user_id,
            "email": email,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        .execute()
    )
    if getattr(ins, "error", None):
        raise HTTPException(status_code=500, detail=f"user_profiles INSERT error: {ins.error}")

    return user_id, email

def ensure_user_usage_row(user_id: str, email: str, feature: str = "prixplainer") -> None:
    """
    Guarantees a row exists in user_usage for (user_id, feature).
    """
    res = (
        supabase_admin
        .table("user_usage")
        .select("user_id,feature")
        .eq("user_id", user_id)
        .eq("feature", feature)
        .execute()
    )
    if getattr(res, "error", None):
        raise HTTPException(status_code=500, detail=f"user_usage SELECT error: {res.error}")

    if res.data:
        return

    ins = (
        supabase_admin
        .table("user_usage")
        .insert({
            "user_id": user_id,
            "email": email,
            "feature": feature,
            "free_runs_used": 0,
            "pro_runs_used": 0,
            "usage_count": 0,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "last_used_at": None,
        })
        .execute()
    )
    if getattr(ins, "error", None):
        raise HTTPException(status_code=500, detail=f"user_usage INSERT error: {ins.error}")
    

def require_user_id_from_jwt(request: Request) -> str:
    """
    Expects frontend to send Authorization: Bearer <supabase_access_token>
    Uses your existing supabase_auth client to validate token and return user id.
    """
    token = get_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Missing Authorization Bearer token")

    # ✅ For supabase-py (sync client), this is the typical way:
    # If your client differs, tell me what supabase_auth is and I’ll adjust.
    user_res = supabase_auth.auth.get_user(token)
    user = getattr(user_res, "user", None) or user_res.get("user") if isinstance(user_res, dict) else None

    if not user or not getattr(user, "id", None):
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user.id

def increment_and_check_prixplainer_quota(user_id: str) -> Dict[str, Any]:
    """
    Uses table: public.user_usage
    Columns assumed:
      - user_id (uuid, primary key or unique)
      - prixplainer_count (int)
      - updated_at (timestamp) optional
    """
    # 1) fetch current usage
    existing = (
        supabase_admin
        .table("user_usage")
        .select("user_id, prixplainer_count")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    data = getattr(existing, "data", None) or existing.get("data", [])
    if data and len(data) > 0:
        current = int(data[0].get("prixplainer_count") or 0)
    else:
        current = 0
        # create row if missing
        supabase_admin.table("user_usage").insert({
            "user_id": user_id,
            "prixplainer_count": 0
        }).execute()

    # 2) enforce limit
    if current >= FREE_PRIXPLAINER_TRIES:
        raise HTTPException(
            status_code=402,
            detail=f"Free limit reached ({FREE_PRIXPLAINER_TRIES}). Subscribe to Pro to continue."
        )

    # 3) increment
    new_count = current + 1
    supabase_admin.table("user_usage").update({
        "prixplainer_count": new_count
    }).eq("user_id", user_id).execute()

    return {"previous": current, "now": new_count, "limit": FREE_PRIXPLAINER_TRIES}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "prixplainer-backend"}

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)

class PrixplainerRequest(BaseModel):
    text: str

@app.post("/api/prixplainer/analyze")
def analyze(req: PrixplainerRequest):
    pred = predict(req.text)
    return {"summary": "PrivBERT classification result", "prediction": pred}

# @app.post("/api/prixplainer/annotate")
# def prixplainer_annotate(payload: dict = Body(...)):
#     text = payload.get("text", "")
#     threshold = float(payload.get("threshold", 0.0))
#     top_k = int(payload.get("top_k", 5))
#     return annotate_policy(text=text, threshold=threshold, top_k=top_k)

from fastapi import Request, Body, HTTPException
from db.supabase_admin import supabase_admin
from db.usage import increment_prixplainer_usage

# @app.post("/api/prixplainer/annotate")
# async def prixplainer_annotate(request: Request, payload: dict = Body(...)):
#     email = request.headers.get("x-user-email")
#     if not email:
#         raise HTTPException(status_code=401, detail="Missing x-user-email header")

#     # Resolve user_id from DB
#     prof = (
#         supabase_admin
#         .table("user_profiles")
#         .select("user_id,email")
#         .eq("email", email)
#         .execute()
#     )

#     if getattr(prof, "error", None):
#         raise HTTPException(status_code=500, detail=f"user_profiles lookup error: {prof.error}")

#     prof_rows = prof.data or []
#     if not prof_rows:
#         raise HTTPException(status_code=404, detail="No user_profiles row found for this email")

#     user_id = prof_rows[0]["user_id"]

#     usage = increment_prixplainer_usage(user_id, email)



#     if usage.get("allowed") is False:
#         raise HTTPException(
#         status_code=402,
#         detail="Free limit reached (2 runs). Please subscribe to Pro."
#     )
    

#     text = payload.get("text", "")
#     threshold = float(payload.get("threshold", 0.0))
#     top_k = int(payload.get("top_k", 5))

#     result = annotate_policy(text=text, threshold=threshold, top_k=top_k)
#     return {**result, "usage": usage}

@app.post("/api/prixplainer/annotate")
async def prixplainer_annotate(request: Request, payload: dict = Body(...)):
    email = request.headers.get("x-user-email")
    if not email:
        raise HTTPException(status_code=401, detail="Missing x-user-email header")

    # ✅ Make sure user exists in user_profiles (even if it was empty before)
    user_id, email = ensure_user_profile(email, request)

    # ✅ Make sure usage row exists
    ensure_user_usage_row(user_id, email, feature="prixplainer")

    # ✅ Fetch current free usage BEFORE increment to enforce limit properly
    usage_res = (
        supabase_admin
        .table("user_usage")
        .select("free_runs_used,pro_runs_used,usage_count")
        .eq("user_id", user_id)
        .eq("feature", "prixplainer")
        .execute()
    )
    if getattr(usage_res, "error", None):
        raise HTTPException(status_code=500, detail=f"user_usage lookup error: {usage_res.error}")

    usage_rows = usage_res.data or []
    free_used = int((usage_rows[0].get("free_runs_used") if usage_rows else 0) or 0)

    # ✅ Paywall: free users get 2 runs
    if free_used >= 2:
        raise HTTPException(
            status_code=402,
            detail="Free limit reached. Please subscribe to the Pro plan to continue using PriXplainer."
        )

    # ✅ Increment usage (your existing function is fine)
    usage = increment_prixplainer_usage(user_id, email)

    # ✅ Run annotate
    text = payload.get("text", "")
    threshold = float(payload.get("threshold", 0.0))
    top_k = int(payload.get("top_k", 5))
    result = annotate_policy(text=text, threshold=threshold, top_k=top_k)

    return {**result, "usage": usage}