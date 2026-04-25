from datetime import datetime
from app.models.alert import Alert, Threshold
from app.extensions import db

def check_and_trigger(hospital_id, resource_type, new_value):
    threshold = Threshold.query.filter_by(
        hospital_id=hospital_id,
        resource_type=resource_type
    ).first()

    if not threshold:
        return  # no threshold configured, skip

    existing_active_alert = Alert.query.filter_by(
        hospital_id=hospital_id,
        resource_type=resource_type,
        status='active'
    ).first()

    if new_value <= threshold.min_value:
        if not existing_active_alert:
            # Create new alert
            severity = 'critical' if new_value == 0 else 'warning'
            alert = Alert(
                hospital_id=hospital_id,
                resource_type=resource_type,
                threshold_value=threshold.min_value,
                current_value=new_value,
                severity=severity,
                status='active'
            )
            db.session.add(alert)
    else:
        if existing_active_alert:
            # Auto-resolve alert
            existing_active_alert.status = 'resolved'
            existing_active_alert.resolved_at = datetime.utcnow()
    
    db.session.commit()
