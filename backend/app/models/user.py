from app.extensions import db, bcrypt
from datetime import datetime
import uuid

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(30), nullable=False)  # 'system_admin','hospital_admin','operator','authority'
    hospital_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('hospitals.hospital_id'))
    status = db.Column(db.String(20), default='active')
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'
