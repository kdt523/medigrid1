from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.alert import Alert
from app.models.user import User
from app.extensions import db
from app.schemas.alert_schema import alerts_schema, alert_schema
from app.utils.responses import success_response, error_response
from app.services.audit_service import log_action
from datetime import datetime

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('', methods=['GET'])
@jwt_required()
def get_alerts():
    status = request.args.get('status', 'all')
    hospital_id = request.args.get('hospital_id')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    query = Alert.query

    # Role-based filtering
    if user.role == 'hospital_admin':
        query = query.filter_by(hospital_id=user.hospital_id)
    elif hospital_id:
        query = query.filter_by(hospital_id=hospital_id)

    if status == 'active':
        query = query.filter_by(status='active')
    elif status == 'resolved':
        query = query.filter_by(status='resolved')

    alerts = query.order_by(Alert.triggered_at.desc()).all()
    return success_response({"alerts": alerts_schema.dump(alerts)})

@alerts_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_alert_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    query = Alert.query
    if user.role == 'hospital_admin':
        query = query.filter_by(hospital_id=user.hospital_id)
        
    active_count = query.filter_by(status='active').count()
    resolved_today = query.filter_by(status='resolved').filter(Alert.resolved_at >= datetime.utcnow().replace(hour=0, minute=0, second=0)).count()
    
    # Calculate avg resolution time (dummy logic for now or real if data exists)
    resolved_alerts = query.filter(Alert.status == 'resolved', Alert.resolved_at.isnot(None)).all()
    if resolved_alerts:
        total_min = sum(((a.resolved_at - a.triggered_at).total_seconds() / 60 for a in resolved_alerts))
        avg_res = round(total_min / len(resolved_alerts))
    else:
        avg_res = 0

    return success_response({
        "active_count": active_count,
        "resolved_today": resolved_today,
        "avg_resolution_minutes": avg_res
    })

@alerts_bp.route('/<alert_id>/resolve', methods=['PATCH'])
@jwt_required()
def resolve_alert(alert_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    alert = Alert.query.get_or_404(alert_id)
    
    if user.role == 'hospital_admin' and str(user.hospital_id) != str(alert.hospital_id):
        return error_response("Forbidden", 403)

    data = request.get_json() or {}
    
    alert.status = 'resolved'
    alert.resolved_at = datetime.utcnow()
    alert.resolved_by = user_id
    
    db.session.commit()
    
    log_action(user_id, "UPDATE", "alert", alert.alert_id, 
               old_value={"status": "active"}, 
               new_value={"status": "resolved", "note": data.get('resolution_note')})
               
    return success_response(alert_schema.dump(alert), "Alert resolved")
