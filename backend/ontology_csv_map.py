import os
import pandas as pd

def _norm(s: str) -> str:
    return " ".join(str(s or "").strip().split()).lower()

DEFAULT_META = {
    "category": "Other",
    "sub_category": "Unmapped",
    "fine_grained": "Unmapped",
    "rating": "neutral",
    "action": "Review this clause manually.",
}

def _detect_col(df, candidates):
    # normalize df cols to compare robustly (handles "Sub-Category", "Fine-grained category", etc.)
    cols_norm = {c.lower().strip(): c for c in df.columns}
    for cand in candidates:
        cand_norm = cand.lower().strip()
        if cand_norm in cols_norm:
            return cols_norm[cand_norm]
    return None

# -------------------------
# emnlp_cat_sub.csv loader
# -------------------------
def load_emnlp_cat_sub_map(path: str) -> dict:
    df = pd.read_csv(path)

    label_col = _detect_col(df, ["label", "case", "tosdr_case", "pred_label", "Case"])
    cat_col   = _detect_col(df, ["category", "broad", "broad_category", "Category"])
    sub_col   = _detect_col(df, ["sub_category", "subcategory", "sub", "Sub-Category", "Sub Category"])
    fine_col  = _detect_col(df, ["fine_grained", "finegrained", "fine", "fine_grained_category",
                                 "Fine-grained category", "Fine grained category", "Fine-Grained Category"])
    action_col= _detect_col(df, ["action", "recommendation", "suggested_action"])

    if any(c is None for c in [label_col, cat_col, sub_col, fine_col]):
        raise ValueError(
            f"emnlp_cat_sub.csv missing required columns.\n"
            f"Found: {list(df.columns)}\n"
            f"Need: Case/Label + Category + Sub-Category + Fine-grained category (names can vary)."
        )

    m = {}
    for _, r in df.iterrows():
        key = _norm(r[label_col])
        m[key] = {
            "category": str(r[cat_col]).strip() if pd.notna(r[cat_col]) else DEFAULT_META["category"],
            "sub_category": str(r[sub_col]).strip() if pd.notna(r[sub_col]) else DEFAULT_META["sub_category"],
            "fine_grained": str(r[fine_col]).strip() if pd.notna(r[fine_col]) else DEFAULT_META["fine_grained"],
            "action": str(r[action_col]).strip() if action_col and pd.notna(r[action_col]) else DEFAULT_META["action"],
        }
    return m

# -------------------------
# case_ratings.csv loader
# -------------------------
def load_case_ratings_map(path: str) -> dict:
    df = pd.read_csv(path)

    # Your file has "case" and "class" and "score"
    label_col  = _detect_col(df, ["label", "case", "Case", "tosdr_case", "pred_label"])
    # Prefer "class" as rating (good/bad/blocker), else try other typical names, else we’ll fallback gracefully.
    rating_col = _detect_col(df, ["class", "rating", "risk", "risk_rating", "severity"])
    score_col  = _detect_col(df, ["score", "weight", "case_score"])

    action_col = _detect_col(df, ["action", "recommendation", "suggested_action"])
    topic_col  = _detect_col(df, ["Topic", "topic"])
    title_col  = _detect_col(df, ["Title", "title"])
    url_col    = _detect_col(df, ["URL", "url", "link"])

    if label_col is None:
        raise ValueError(
            f"case_ratings.csv missing required label column.\n"
            f"Found: {list(df.columns)}\n"
            f"Need: a 'case' or 'label' column."
        )

    # If rating_col is missing, do NOT crash the app. Just return an empty map (rating will stay neutral).
    if rating_col is None and score_col is None:
        print(
            "[ontology_csv_map] WARN: case_ratings.csv has no rating/class or score column. "
            "Ratings will default to 'neutral'. Found columns:", list(df.columns)
        )
        return {}

    m = {}
    for _, r in df.iterrows():
        key = _norm(r[label_col])

        rating_val = None

        # 1) If we have "class" (good/bad/blocker), use it
        if rating_col and pd.notna(r[rating_col]):
            rating_val = str(r[rating_col]).strip().lower()

        # 2) Else if only score exists, you can optionally map numeric scores to buckets
        #    (If you don’t want this behavior, comment this block out.)
        if (not rating_val) and score_col and pd.notna(r[score_col]):
            try:
                score = float(r[score_col])
                # Example heuristic (tweak later if needed):
                # high score = worse
                if score >= 0.75:
                    rating_val = "blocker"
                elif score >= 0.40:
                    rating_val = "bad"
                elif score >= 0.15:
                    rating_val = "good"
                else:
                    rating_val = "neutral"
            except Exception:
                rating_val = None

        # optional action synthesis from topic/title/url if explicit action missing
        action_val = None
        if action_col and pd.notna(r[action_col]):
            action_val = str(r[action_col]).strip()
        else:
            parts = []
            if topic_col and pd.notna(r[topic_col]): parts.append(str(r[topic_col]).strip())
            if title_col and pd.notna(r[title_col]): parts.append(str(r[title_col]).strip())
            if url_col and pd.notna(r[url_col]): parts.append(str(r[url_col]).strip())
            if parts:
                action_val = "Review: " + " | ".join(parts)

        m[key] = {
            "rating": rating_val or "neutral",
            "action": action_val,  # may be None
        }

    return m

def build_label_meta_map(emnlp_map: dict, rating_map: dict) -> dict:
    out = {}
    for k in (set(emnlp_map) | set(rating_map)):
        meta = dict(DEFAULT_META)
        if k in emnlp_map:
            meta.update(emnlp_map[k])
        if k in rating_map:
            meta["rating"] = rating_map[k].get("rating") or meta["rating"]
            if rating_map[k].get("action"):
                meta["action"] = rating_map[k]["action"]
        out[k] = meta
    return out

# ---- Load once at import time ----
EMNLP_PATH = os.getenv("EMNLP_CAT_SUB_CSV", "")
RATINGS_PATH = os.getenv("CASE_RATINGS_CSV", "")

LABEL_META_MAP = {}
try:
    if EMNLP_PATH:
        emnlp_map = load_emnlp_cat_sub_map(EMNLP_PATH)
    else:
        emnlp_map = {}
        print("[ontology_csv_map] WARN: EMNLP_CAT_SUB_CSV not set. Category mapping will be default.")

    if RATINGS_PATH:
        rating_map = load_case_ratings_map(RATINGS_PATH)
    else:
        rating_map = {}
        print("[ontology_csv_map] WARN: CASE_RATINGS_CSV not set. Ratings will be default.")

    LABEL_META_MAP = build_label_meta_map(emnlp_map, rating_map)

    print(f"[ontology_csv_map] Loaded mappings. emnlp={len(emnlp_map)} ratings={len(rating_map)} merged={len(LABEL_META_MAP)}")

except Exception as e:
    print(f"[ontology_csv_map] ERROR loading CSV mappings: {e}")
    LABEL_META_MAP = {}

def map_label(label: str) -> dict:
    return LABEL_META_MAP.get(_norm(label), DEFAULT_META)