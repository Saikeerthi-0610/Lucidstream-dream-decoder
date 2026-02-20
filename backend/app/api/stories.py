from fastapi import APIRouter, HTTPException
from app.db.session import SessionLocal
from app.db.models import Base
from app.db.models import Story
from datetime import datetime

router = APIRouter(
    prefix="/stories",
    tags=["Stories"]
)

@router.get("/")
def list_stories():
    db = SessionLocal()
    try:
        records = db.query(Story).order_by(Story.id.desc()).all()
        # Seed with sample stories if empty
        if not records:
            sample = [
                Story(author="Maya", title="The House at the Edge of the Lake", content="I woke up in a house that felt exactly like my grandmother's, but there was a door I had never seen before...", created_at=datetime.utcnow().isoformat()),
                Story(author="Owen", title="The City of Mirrors", content="Every reflection showed a different version of me — some braver, some smaller, all watching me walk by...", created_at=datetime.utcnow().isoformat()),
                Story(author="Rina", title="The Compass and the Map", content="I pulled a map off the wall and the lines rearranged themselves into places I felt I should go next...", created_at=datetime.utcnow().isoformat()),
            ]
            for s in sample:
                db.add(s)
            db.commit()
            records = db.query(Story).order_by(Story.id.desc()).all()

        return [
            {
                "id": r.id,
                "title": r.title,
                "author": r.author,
                "excerpt": (r.content[:140] + "...") if len(r.content) > 140 else r.content,
                "created_at": r.created_at,
            }
            for r in records
        ]
    finally:
        db.close()

@router.get("/{story_id}")
def get_story(story_id: int):
    db = SessionLocal()
    try:
        s = db.query(Story).filter(Story.id == story_id).first()
        if not s:
            raise HTTPException(status_code=404, detail="Story not found")
        return {
            "id": s.id,
            "title": s.title,
            "author": s.author,
            "content": s.content,
            "created_at": s.created_at,
        }
    finally:
        db.close()

@router.post("/")
def create_story(payload: dict):
    # payload expected: {"author": str, "title": str, "content": str}
    db = SessionLocal()
    try:
        author = payload.get("author") or "Guest"
        title = payload.get("title") or "Untitled"
        content = payload.get("content") or ""
        s = Story(author=author, title=title, content=content, created_at=datetime.utcnow().isoformat())
        db.add(s)
        db.commit()
        db.refresh(s)
        return {"id": s.id}
    finally:
        db.close()