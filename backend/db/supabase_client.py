import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Always load backend/.env (no matter where uvicorn is launched from)
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"   # -> backend/.env
load_dotenv(dotenv_path=ENV_PATH, override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_PUBLISHABLE_KEY = os.getenv("SUPABASE_ANON_KEY")

print("DEBUG ENV_PATH:", ENV_PATH)
print("DEBUG SUPABASE_URL present?", bool(SUPABASE_URL))
print("DEBUG SUPABASE_PUBLISHABLE_KEY present?", bool(SUPABASE_PUBLISHABLE_KEY))

if not SUPABASE_URL or not SUPABASE_PUBLISHABLE_KEY:
    raise RuntimeError("SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY missing")

supabase_auth = create_client(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)