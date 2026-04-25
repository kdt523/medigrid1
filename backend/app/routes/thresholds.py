from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.alert import Threshold
from app.models.hospital import Hospital
from app.extensions import db
from app.schemas.alert_schema import thresholds_schema, threshold_schema
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response
from app.services.audit_service import log_action

thresholds_bp = Blueprint('thresholds', __name__)

@thresholds_bp.route('', methods=['GET'])
@jwt_required()
@role_required('system_admin', 'authority')
def get_thresholds():
    thresholds = Threshold.query.all()
    return success_response({"thresholds": thresholds_schema.dump(thresholds)})

@thresholds_bp.route('/<hospital_id>', methods=['PUT'])
@jwt_required()
@role_required('system_admin', 'authority')
def update_thresholds(hospital_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    updated = []
    for r_type, min_val in data.items():
        threshold = Threshold.query.filter_by(hospital_id=hospital_id, resource_type=r_type).first()
        if not threshold:
            threshold = Threshold(hospital_id=hospital_id, resource_type=r_type, min_value=min_val)
            db.session.add(threshold)
        else:
            threshold.min_value = min_val
        updated.append(threshold)

    db.session.commit()
    log_action(user_id, "UPDATE", "thresholds", hospital_id, new_value=data)
    
    return success_response(thresholds_schema.dump(updated), "Thresholds updated")
