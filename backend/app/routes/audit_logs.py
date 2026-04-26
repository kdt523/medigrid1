from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.models.audit_log import AuditLog
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response
from marshmallow import Schema, fields
from datetime import datetime

audit_logs_bp = Blueprint('audit_logs', __name__)

class AuditLogSchema(Schema):
    log_id = fields.UUID()
    action = fields.Str()
    entity_type = fields.Str()
    entity_id = fields.UUID(allow_none=True)
    old_value = fields.Dict(allow_none=True)
    new_value = fields.Dict(allow_none=True)
    ip_address = fields.Str(allow_none=True)
    timestamp = fields.DateTime(attribute="created_at")
    user = fields.Method("get_user")

    def get_user(self, obj):
        return obj.user.name if obj.user else "System"

audit_log_schema = AuditLogSchema()
audit_logs_schema = AuditLogSchema(many=True)

@audit_logs_bp.route('', methods=['GET'])
@jwt_required()
@role_required('system_admin')
def get_audit_logs():
    try:
        action = request.args.get('action')
        entity_type = request.args.get('entity_type')
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        query = AuditLog.query

        if action:
            query = query.filter_by(action=action)
        if entity_type:
            query = query.filter_by(entity_type=entity_type)
        if from_date:
            from_ts = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
            query = query.filter(AuditLog.created_at >= from_ts)
        if to_date:
            to_ts = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
            query = query.filter(AuditLog.created_at <= to_ts)

        pagination = query.order_by(AuditLog.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

        return success_response({
            "logs": audit_logs_schema.dump(pagination.items),
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page
        })
    except Exception as e:
        return error_response(str(e))
