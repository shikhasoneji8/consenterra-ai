from db.supabase_admin import supabase_admin

FREE_LIMIT = 2

def increment_prixplainer_usage(user_id: str, email: str):
    """
    Increment usage counters for PriXplainer.
    Enforces 2 free runs: blocks after limit is reached.
    """

    # 1) Fetch usage row
    res = (
        supabase_admin
        .table("user_usage")
        .select("user_id, feature, free_runs_used, pro_runs_used, usage_count")
        .eq("user_id", user_id)
        .eq("feature", "prixplainer")
        .execute()
    )

    if getattr(res, "error", None):
        print("❌ user_usage SELECT error:", res.error)
        raise Exception(f"user_usage SELECT error: {res.error}")

    rows = res.data or []
    if len(rows) == 0:
        print("⚠️ No user_usage row found. Inserting fallback row...")
        ins = supabase_admin.table("user_usage").insert({
            "user_id": user_id,
            "email": email,
            "feature": "prixplainer",
            "free_runs_used": 0,
            "pro_runs_used": 0,
            "usage_count": 0,
        }).execute()

        if getattr(ins, "error", None):
            print("❌ user_usage INSERT error:", ins.error)
            raise Exception(f"user_usage INSERT error: {ins.error}")

        free_runs_used = 0
        pro_runs_used = 0
        usage_count = 0
    else:
        row = rows[0]
        free_runs_used = int(row.get("free_runs_used") or 0)
        pro_runs_used = int(row.get("pro_runs_used") or 0)
        usage_count = int(row.get("usage_count") or 0)

    # ✅ 2) Enforce free limit BEFORE incrementing
    if free_runs_used >= FREE_LIMIT:
        print("🚫 Free limit reached:", free_runs_used)
        return {
            "allowed": False,
            "usage_count": usage_count,
            "free_runs_used": free_runs_used,
            "pro_runs_used": pro_runs_used,
        }

    # 3) Update counters
    new_usage_count = usage_count + 1
    new_free_runs = free_runs_used + 1

    upd = (
        supabase_admin
        .table("user_usage")
        .update({
            "usage_count": new_usage_count,
            "free_runs_used": new_free_runs,
        })
        .eq("user_id", user_id)
        .eq("feature", "prixplainer")
        .execute()
    )

    if getattr(upd, "error", None):
        print("❌ user_usage UPDATE error:", upd.error)
        raise Exception(f"user_usage UPDATE error: {upd.error}")

    print("✅ Updated usage:", {
        "user_id": user_id,
        "usage_count": new_usage_count,
        "free_runs_used": new_free_runs,
        "pro_runs_used": pro_runs_used,
    })

    return {
        "allowed": True,
        "usage_count": new_usage_count,
        "free_runs_used": new_free_runs,
        "pro_runs_used": pro_runs_used,
    }