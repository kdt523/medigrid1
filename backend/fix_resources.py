from app import create_app
from app.extensions import db
from app.models.resource import Resource

app = create_app()
with app.app_context():
    resources = Resource.query.filter_by(total_count=0).all()
    for r in resources:
        if r.resource_type == 'general_bed':
            r.total_count = 500
            r.available_count = 500
        elif r.resource_type == 'icu_bed':
            r.total_count = 100
            r.available_count = 100
        elif r.resource_type == 'ventilator':
            r.total_count = 50
            r.available_count = 50
    db.session.commit()
    print(f"Fixed {len(resources)} resources.")
