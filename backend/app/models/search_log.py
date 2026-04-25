from app.extensions import db
from datetime import datetime
import uuid

class SearchLog(db.Model):
    __tablename__ = 'search_logs'
    
    log_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.user_id'))  # nullable for public searches
    query_text = db.Column(db.Text)
    zone_filter = db.Column(db.String(50))
    resource_filter = db.Column(db.String(30))
    results_count = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='search_logs')

    def __repr__(self):
        return f'<SearchLog {self.query_text}>'
