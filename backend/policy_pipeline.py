# backend/policy_pipeline.py
import re
from typing import Dict, Any, List

from privbert_infer import predict
from ontology_map import map_label
from ontology_csv_map import map_label


def _sent_split(text: str) -> List[str]:
    if not text:
        return []
    parts = [s.strip() for s in re.split(r'(?<=[\.\!\?])\s+', text) if s.strip()]
    out = [q.strip() for p in parts for q in re.split(r'[\n;]+', p) if q.strip()]
    return out or [text.strip()]


def annotate_policy(text: str, threshold: float = 0.0, top_k: int = 5) -> Dict[str, Any]:
    """
    PrivacyWhisper-style response:
      { summary, overall_grade, num_sentences, rows: [...] }
    """

    sentences = _sent_split(text)
    rows = []

    for i, sent in enumerate(sentences, start=1):
        pred = predict(sent, top_k=top_k)
        pred_label = pred.get("label", "Unknown")
        conf = float(pred.get("confidence", 0.0))

        # apply threshold
        if conf < float(threshold or 0.0):
            pred_label = "Unknown"
            conf = 0.0
            top_k_list = []
            meta = map_label("Unknown")
        else:
            top_k_list = pred.get("top_k", [])
            meta = map_label(pred_label)

        row = {
            "id": i,
            "text": sent,
            "label": pred_label,
            "confidence": conf,
            "category": meta["category"],
            "sub_category": meta["sub_category"],
            "fine_grained": meta["fine_grained"],
            "rating": meta["rating"],
            "action": meta["action"],
            "top_k": top_k_list,
        }
        rows.append(row)

    # Simple grade placeholder (you can replace later with your PrivacyWhisper grading logic)
    overall_grade = "A"  # keep stable for now

    return {
        "summary": "",
        "overall_grade": overall_grade,
        "num_sentences": len(sentences),
        "rows": rows,
    }