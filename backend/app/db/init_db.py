from app.db.session import engine
from app.db.models import Base

def init_db():
    Base.metadata.create_all(bind=engine)
    try:
        from sqlalchemy import text
        # Ensure new columns exist in existing SQLite tables (non-destructive)
        with engine.begin() as conn:
            def get_columns(table_name: str):
                rows = conn.exec_driver_sql(f"PRAGMA table_info({table_name});").fetchall()
                # row[1] is the column name
                return {row[1] for row in rows}

            # Users table columns
            users_cols = get_columns("users")
            if "isActive" not in users_cols:
                conn.exec_driver_sql("ALTER TABLE users ADD COLUMN isActive BOOLEAN DEFAULT 1")
            if "profileCompleted" not in users_cols:
                conn.exec_driver_sql("ALTER TABLE users ADD COLUMN profileCompleted BOOLEAN DEFAULT 1")
            if "lastLogin" not in users_cols:
                conn.exec_driver_sql("ALTER TABLE users ADD COLUMN lastLogin TEXT")
            if "createdAt" not in users_cols:
                conn.exec_driver_sql("ALTER TABLE users ADD COLUMN createdAt TEXT")

            # User profiles table columns
            profiles_cols = get_columns("user_profiles")
            if "preferences" not in profiles_cols:
                conn.exec_driver_sql("ALTER TABLE user_profiles ADD COLUMN preferences TEXT")
            if "joinedAt" not in profiles_cols:
                conn.exec_driver_sql("ALTER TABLE user_profiles ADD COLUMN joinedAt TEXT")
    except Exception as e:
        print(f"[init_db] Schema ensure warning: {e}")
