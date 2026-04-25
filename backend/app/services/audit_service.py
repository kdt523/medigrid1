from datetime import datetime
from app.models.audit_log import AuditLog
from app.extensions import db

def log_action(user_id, action, entity_type, entity_id=None, old_value=None, new_value=None, ip_address=None):
    entry = AuditLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        old_value=old_value,
        new_value=new_value,
        ip_address=ip_address,
        created_at=datetime.utcnow()
    )
    db.session.add(entry)
    db.session.commit()
