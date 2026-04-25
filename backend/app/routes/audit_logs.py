from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.audit_log import AuditLog
from app.utils.decorators import role_required
from app.utils.responses import success_response

audit_logs_bp = Blueprint('audit_logs', __name__)

@audit_logs_bp.route('', methods=['GET'])
@jwt_required()
@role_required('system_admin')
def get_audit_logs():
    action = request.args.get('action')
    entity_type = request.args.get('entity_type')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = AuditLog.query

    if action:
        query = query.filter_by(action=action)
    if entity_type:
        query = query.filter_by(entity_type=entity_type)

    pagination = query.order_by(AuditLog.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    logs = []
    for log in pagination.items:
        logs.append({
            "log_id": str(log.log_id),
            "user": log.user.name if log.user else "System",
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": str(log.entity_id) if log.entity_id else None,
            "old_value": log.old_value,
            "new_value": log.new_value,
            "ip_address": log.ip_address,
            "timestamp": log.created_at.isoformat()
        })

    return success_response({
        "logs": logs,
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page
    })
