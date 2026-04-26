from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import db
from app.schemas.user_schema import users_schema, user_schema
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response
from app.services.audit_service import log_action

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
@jwt_required()
@role_required('system_admin')
def get_users():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        pagination = User.query.paginate(page=page, per_page=per_page, error_out=False)
        return success_response({
            "users": users_schema.dump(pagination.items),
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page
        })
    except Exception as e:
        return error_response(str(e))

@users_bp.route('', methods=['POST'])
@jwt_required()
@role_required('system_admin')
def create_user():
    data = request.get_json() or {}
    user_id = get_jwt_identity()

    try:
        if User.query.filter_by(email=data.get('email')).first():
            return error_response("Email already exists", 400)

        if data.get('role') == 'hospital_admin' and not data.get('hospital_id'):
            return error_response("hospital_id is required for hospital_admin", 400)

        user = User(
            name=data['name'],
            email=data['email'],
            role=data['role'],
            hospital_id=data.get('hospital_id'),
            status='active'
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        log_action(user_id, "CREATE", "user", user.user_id, new_value=user_schema.dump(user))

        return success_response(user_schema.dump(user), "User created", 201)
    except Exception as e:
        db.session.rollback()
        return error_response(str(e))

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
@role_required('system_admin')
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    admin_id = get_jwt_identity()

    try:
        old_val = user_schema.dump(user)

        user.name = data.get('name', user.name)
        user.role = data.get('role', user.role)
        user.hospital_id = data.get('hospital_id', user.hospital_id)
        user.status = data.get('status', user.status)

        if data.get('password'):
            user.set_password(data['password'])

        db.session.commit()
        log_action(admin_id, "UPDATE", "user", user.user_id, old_value=old_val, new_value=user_schema.dump(user))

        return success_response(user_schema.dump(user), "User updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e))

@users_bp.route('/<user_id>/status', methods=['PATCH'])
@jwt_required()
@role_required('system_admin')
def toggle_user_status(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    admin_id = get_jwt_identity()

    try:
        user.status = data.get('status', 'inactive')
        db.session.commit()

        log_action(admin_id, "UPDATE", "user_status", user.user_id, new_value={"status": user.status})

        return success_response(None, f"User status updated to {user.status}")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e))
