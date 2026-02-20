from fastapi import APIRouter
from app.db.session import SessionLocal
from app.db.models import Prediction
from app.api.predict import load_model

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get("/")
def get_health():
    """Return service health. "ok" when DB and model are available, otherwise "degraded"."""
    db_ok = False
    model_ok = False

    # DB check
    db = None
    try:
        db = SessionLocal()
        # simple query to ensure tables exist and are queryable
        _ = db.query(Prediction).first()
        db_ok = True
    except Exception:
        db_ok = False
    finally:
        try:
            if db:
                db.close()
        except Exception:
            pass

    # Model check (do not propagate exception)
    try:
        load_model()
        model_ok = True
    except Exception:
        model_ok = False

    status = "ok" if db_ok and model_ok else "degraded"

    return {
        "status": status,
        "db": db_ok,
        "model": model_ok
    }
