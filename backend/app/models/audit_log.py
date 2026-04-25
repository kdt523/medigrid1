from app.extensions import db
from datetime import datetime
import uuid

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    log_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    action = db.Column(db.String(30), nullable=False)  # 'CREATE','UPDATE','DELETE','LOGIN','LOGOUT'
    entity_type = db.Column(db.String(50))           # 'hospital','resource','user','alert'
    entity_id = db.Column(db.UUID(as_uuid=True))
    old_value = db.Column(db.JSON)
    new_value = db.Column(db.JSON)
    ip_address = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='audit_logs')

    def __repr__(self):
        return f'<AuditLog {self.action} by {self.user_id}>'
