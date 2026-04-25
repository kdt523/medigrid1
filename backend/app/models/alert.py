from app.extensions import db
from datetime import datetime
import uuid

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    alert_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hospital_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('hospitals.hospital_id'), nullable=False)
    resource_type = db.Column(db.String(30), nullable=False)
    threshold_value = db.Column(db.Integer, nullable=False)
    current_value = db.Column(db.Integer, nullable=False)
    triggered_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    resolved_by = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    status = db.Column(db.String(20), default='active')  # 'active' or 'resolved'
    severity = db.Column(db.String(20), default='warning') # 'critical','warning','info'

    def __repr__(self):
        return f'<Alert {self.resource_type} at {self.hospital_id}>'

class Threshold(db.Model):
    __tablename__ = 'thresholds'
    
    threshold_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hospital_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('hospitals.hospital_id'), nullable=False)
    resource_type = db.Column(db.String(30), nullable=False)
    min_value = db.Column(db.Integer, nullable=False, default=5)

    __table_args__ = (
        db.UniqueConstraint('hospital_id', 'resource_type', name='unique_hospital_threshold'),
    )

    def __repr__(self):
        return f'<Threshold {self.resource_type} for {self.hospital_id}>'
