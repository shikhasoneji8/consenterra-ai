# backend/ontology_map.py
from config import CASE_RATINGS_CSV, EMNLP_CAT_SUB_CSV
from ontology_csv_map import map_label, DEFAULT_META
from ontology_csv_map import (
    load_case_ratings_map,
    load_emnlp_cat_sub_map,
    build_label_meta_map,
    _norm,
    DEFAULT_META,
)

LABEL_META_MAP = {}

try:
    EMNLP_MAP = load_emnlp_cat_sub_map(EMNLP_CAT_SUB_CSV)
    RATING_MAP = load_case_ratings_map(CASE_RATINGS_CSV)
    LABEL_META_MAP = build_label_meta_map(EMNLP_MAP, RATING_MAP)
    # print(f"[ontology_map] Loaded mappings: emnlp={len(EMNLP_MAP)}, ratings={len(RATING_MAP)}, merged={len(LABEL_META_MAP)}")
    # print("[ontology_map] EMNLP rows:", len(EMNLP_MAP))
    # print("[ontology_map] Ratings rows:", len(RATING_MAP))
    # print("[ontology_map] Meta map keys:", len(LABEL_META_MAP))
    # print("[ontology_map] sample keys:", list(LABEL_META_MAP.keys())[:5])
except Exception as e:
    print(f"[ontology_map] ERROR loading mappings: {e}")
    LABEL_META_MAP = {}


def map_label(label: str) -> dict:
    key = _norm(label)
    meta = LABEL_META_MAP.get(key)
    if meta is None:
        # keep it quiet if you want; leaving it helps debugging
        # print(f"[ontology_map] Unmapped: {label}")
        return DEFAULT_META
    return meta