from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.hospital import Hospital
from app.models.resource import Resource
from app.models.user import User
from app.extensions import db
from app.services.alert_service import check_and_trigger
from app.services.audit_service import log_action
from app.utils.responses import success_response, error_response
from app.schemas.hospital_schema import hospital_schema

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('/<hospital_id>', methods=['PATCH'])
@jwt_required()
def update_resources(hospital_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Permission check
    if user.role == 'hospital_admin' and str(user.hospital_id) != hospital_id:
        return error_response("Forbidden: You can only update your own hospital", 403)
    
    if user.role not in ['hospital_admin', 'system_admin']:
        return error_response("Forbidden: Unauthorized role", 403)

    data = request.get_json()
    hospital = Hospital.query.get_or_404(hospital_id)
    
    updates = []
    errors = {}

    for r_type, available in data.items():
        resource = Resource.query.filter_by(hospital_id=hospital_id, resource_type=r_type).first()
        if not resource:
            continue
            
        if available > resource.total_count:
            errors[r_type] = f"Available count ({available}) cannot exceed total count ({resource.total_count})"
            continue
            
        old_val = resource.available_count
        resource.available_count = available
        resource.updated_by = user_id
        
        updates.append((r_type, old_val, available))

    if errors:
        return error_response("Validation failed", 400, errors)

    try:
        db.session.commit()
        
        for r_type, old_v, new_v in updates:
            # Trigger alert check
            check_and_trigger(hospital_id, r_type, new_v)
            # Log audit
            log_action(user_id, "UPDATE", "resource", hospital_id, 
                       old_value={r_type: old_v}, new_value={r_type: new_v})
                       
        return success_response(hospital_schema.dump(hospital).get('resources'), "Resources updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e))

@resources_bp.route('/<hospital_id>/history', methods=['GET'])
@jwt_required()
def get_resource_history(hospital_id):
    # This would typically come from audit_logs
    from app.models.audit_log import AuditLog
    logs = AuditLog.query.filter_by(entity_type='resource', entity_id=hospital_id)\
        .order_by(AuditLog.created_at.desc()).limit(20).all()
        
    return success_response([{
        "action": log.action,
        "new_value": log.new_value,
        "timestamp": log.created_at.isoformat(),
        "user": log.user.name if log.user else "System"
    } for log in logs])
