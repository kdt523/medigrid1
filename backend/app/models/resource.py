from app.extensions import db
from datetime import datetime
import uuid

class Resource(db.Model):
    __tablename__ = 'resources'
    
    resource_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hospital_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('hospitals.hospital_id', ondelete='CASCADE'), nullable=False)
    resource_type = db.Column(db.String(30), nullable=False)  # 'general_bed', 'icu_bed', 'ventilator'
    total_count = db.Column(db.Integer, nullable=False, default=0)
    available_count = db.Column(db.Integer, nullable=False, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.user_id'))

    __table_args__ = (
        db.CheckConstraint('available_count >= 0', name='available_count_non_negative'),
        db.CheckConstraint('total_count >= 0', name='total_count_non_negative'),
        db.CheckConstraint('available_count <= total_count', name='available_lte_total'),
        db.UniqueConstraint('hospital_id', 'resource_type', name='unique_hospital_resource')
    )

    def __repr__(self):
        return f'<Resource {self.resource_type} at {self.hospital_id}>'
