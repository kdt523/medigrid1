from app import create_app
from app.extensions import db
from app.models.resource import Resource

app = create_app()
with app.app_context():
    resources = Resource.query.all()
    for r in resources:
        print(f"Hospital {r.hospital_id} - {r.resource_type}: total={r.total_count}, available={r.available_count}")
