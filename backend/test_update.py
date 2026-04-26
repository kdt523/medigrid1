from app import create_app
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token

app = create_app()
with app.app_context():
    # Find a hospital_admin for that hospital
    user = User.query.filter_by(hospital_id='46359e77-85d2-4064-9198-45be4c28352e').first()
    if not user:
        print("No user found for hospital")
    else:
        print(f"Testing with user: {user.email}")
        access_token = create_access_token(identity=str(user.user_id))
        
        client = app.test_client()
        res = client.patch(
            '/api/resources/46359e77-85d2-4064-9198-45be4c28352e',
            json={'general_bed': 100, 'icu_bed': 50, 'ventilator': 10},
            headers={'Authorization': f'Bearer {access_token}'}
        )
        print("Status:", res.status_code)
        print("Data:", res.get_json())
