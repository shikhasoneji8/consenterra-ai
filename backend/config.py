# backend/config.py
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MAX_LEN = 512
TOP_K = 5
THRESHOLD = 0.75

EMNLP_CAT_SUB_CSV = os.getenv("EMNLP_CAT_SUB_CSV", os.path.join(BASE_DIR, "..", "emnlp_cat_sub.csv"))
CASE_RATINGS_CSV  = os.getenv("CASE_RATINGS_CSV",  os.path.join(BASE_DIR, "..", "case_ratings.csv"))

VALID_RATINGS = {"good", "bad", "blocker", "neutral"}