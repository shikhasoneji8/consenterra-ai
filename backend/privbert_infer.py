# backend/privbert_infer.py
import os
import torch
import numpy as np
from typing import Dict, Any, List

from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Globals (will be initialized lazily)
tokenizer = None
model = None
id2label = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def _softmax(x: np.ndarray) -> np.ndarray:
    x = x - np.max(x, axis=-1, keepdims=True)
    e = np.exp(x)
    return e / (e.sum(axis=-1, keepdims=True) + 1e-12)


def load_model(model_dir: str = None) -> Dict[str, Any]:
    """
    Loads the HF model/tokenizer into module-level globals.
    Safe to call multiple times.
    """
    global tokenizer, model, id2label

    if model_dir is None:
        model_dir = os.getenv("MODEL_DIR", "")

    if not model_dir or not os.path.exists(model_dir):
        raise FileNotFoundError(
            f"[privbert_infer] MODEL_DIR not found. Got: {model_dir}. "
            f"Set MODEL_DIR in .env to your privbert_model folder."
        )

    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir).to(device)
    model.eval()

    # label mapping
    cfg = model.config
    id2label = cfg.id2label if hasattr(cfg, "id2label") and cfg.id2label else None

    return {
        "model_dir": model_dir,
        "device": str(device),
        "num_labels": int(getattr(cfg, "num_labels", -1)),
        "has_id2label": bool(id2label),
    }


def _ensure_loaded():
    """Lazy-load model/tokenizer when running under uvicorn reload/spawn."""
    global tokenizer, model, id2label
    if tokenizer is None or model is None:
        load_model()


@torch.no_grad()
def predict(text: str, top_k: int = 5) -> Dict[str, Any]:
    """
    Returns:
      {
        "label": <top label>,
        "confidence": <top prob float>,
        "top_k": [{"label":..., "prob":...}, ...]
      }
    """
    _ensure_loaded()

    text = (text or "").strip()
    if not text:
        return {"label": "Unknown", "confidence": 0.0, "top_k": []}

    enc = tokenizer([text], truncation=True, padding=True, return_tensors="pt")
    enc = {k: v.to(device) for k, v in enc.items()}

    logits = model(**enc).logits.detach().cpu().numpy()[0]
    probs = _softmax(logits)

    # Top-K indices
    k = max(1, int(top_k or 1))
    top_idx = np.argsort(-probs)[:k]

    def _label(i: int) -> str:
        if id2label is not None:
            # keys sometimes are int or str depending on config serialization
            return id2label.get(int(i), id2label.get(str(int(i)), str(int(i))))
        return str(int(i))

    top_list: List[Dict[str, Any]] = [
        {"label": _label(i), "prob": float(probs[i])} for i in top_idx
    ]

    return {
        "label": top_list[0]["label"],
        "confidence": float(top_list[0]["prob"]),
        "top_k": top_list,
    }