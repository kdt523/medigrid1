from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import db
from app.services.audit_service import log_action
from app.utils.responses import success_response, error_response
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return error_response("Invalid credentials", 401)

    if user.status != 'active':
        return error_response("User account is inactive", 403)

    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=str(user.user_id))
    
    log_action(user.user_id, "LOGIN", "user", user.user_id)

    return success_response({
        "access_token": access_token,
        "user": {
            "user_id": str(user.user_id),
            "name": user.name,
            "role": user.role,
            "hospital_id": str(user.hospital_id) if user.hospital_id else None
        }
    })

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    user_id = get_jwt_identity()
    log_action(user_id, "LOGOUT", "user", user_id)
    return success_response(None, "Logged out")

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)
    
    return success_response({
        "user_id": str(user.user_id),
        "name": user.name,
        "role": user.role,
        "hospital_id": str(user.hospital_id) if user.hospital_id else None
    })
