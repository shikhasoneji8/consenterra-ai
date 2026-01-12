import os
import sys
import zipfile
import urllib.request
from pathlib import Path

MODEL_ZIP_URL = os.getenv("MODEL_ZIP_URL", "").strip()
TARGET_DIR = Path(os.getenv("MODEL_DIR", "privbert_model")).resolve()
ZIP_PATH = Path("privbert_model.zip").resolve()

def download(url: str, out_path: Path):
  print(f"[fetch_model] Downloading model from: {url}")
  urllib.request.urlretrieve(url, out_path)
  print(f"[fetch_model] Downloaded to: {out_path} ({out_path.stat().st_size} bytes)")

def unzip(zip_path: Path, target_dir: Path):
  print(f"[fetch_model] Unzipping {zip_path} -> {target_dir}")
  target_dir.mkdir(parents=True, exist_ok=True)
  with zipfile.ZipFile(zip_path, "r") as z:
    z.extractall(target_dir)
  print("[fetch_model] Unzip complete.")

def main():
  if TARGET_DIR.exists() and any(TARGET_DIR.iterdir()):
    print(f"[fetch_model] Model directory already present: {TARGET_DIR}")
    return 0

  if not MODEL_ZIP_URL:
    print("[fetch_model] ERROR: MODEL_ZIP_URL env var is missing.")
    return 1

  download(MODEL_ZIP_URL, ZIP_PATH)
  unzip(ZIP_PATH, TARGET_DIR)

  # Some zips contain a top-level folder; handle that case:
  # If TARGET_DIR/privbert_model exists and TARGET_DIR itself only contains that folder, move contents up.
  inner = TARGET_DIR / "privbert_model"
  if inner.exists() and inner.is_dir():
    # move inner contents up one level
    for p in inner.iterdir():
      p.rename(TARGET_DIR / p.name)
    try:
      inner.rmdir()
    except Exception:
      pass

  print(f"[fetch_model] ✅ Model ready at: {TARGET_DIR}")
  return 0

if __name__ == "__main__":
  sys.exit(main())