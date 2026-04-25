from flask import Blueprint, request, make_response
from flask_jwt_extended import jwt_required
from app.models.hospital import Hospital
from app.models.resource import Resource
from app.models.audit_log import AuditLog
from app.extensions import db
from app.utils.responses import success_response
from app.utils.decorators import role_required as custom_role_required
import csv
import io
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/summary', methods=['GET'])
@jwt_required()
@custom_role_required('authority', 'system_admin')
def get_summary():
    total_hospitals = Hospital.query.count()
    
    # City totals
    city_totals = {}
    for r_type in ['general_bed', 'icu_bed', 'ventilator']:
        total = db.session.query(db.func.sum(Resource.total_count)).filter(Resource.resource_type == r_type).scalar() or 0
        available = db.session.query(db.func.sum(Resource.available_count)).filter(Resource.resource_type == r_type).scalar() or 0
        city_totals[r_type] = {"total": total, "available": available}

    # Zone utilization
    zones = db.session.query(Hospital.zone).distinct().all()
    zone_utilization = []
    for (zone,) in zones:
        total = db.session.query(db.func.sum(Resource.total_count)).join(Hospital).filter(Hospital.zone == zone).scalar() or 1
        available = db.session.query(db.func.sum(Resource.available_count)).join(Hospital).filter(Hospital.zone == zone).scalar() or 0
        util_pct = round(((total - available) / total) * 100)
        zone_utilization.append({"zone": zone, "utilization_pct": util_pct})

    return success_response({
        "total_hospitals": total_hospitals,
        "city_totals": city_totals,
        "zone_utilization": zone_utilization
    })

@analytics_bp.route('/trends', methods=['GET'])
@jwt_required()
@custom_role_required('authority', 'system_admin')
def get_trends():
    range_days = request.args.get('range', '7d')
    days = 7
    if range_days == '30d': days = 30
    elif range_days == '90d': days = 90
    
    # Dummy data for trends based on range
    # In a real app, you'd aggregate from audit_logs or a dedicated trends table
    labels = []
    datasets = {"general_bed": [], "icu_bed": [], "ventilator": []}
    
    for i in range(days):
        date = (datetime.utcnow() - timedelta(days=days-1-i)).strftime("%a" if days == 7 else "%d %b")
        labels.append(date)
        datasets["general_bed"].append(1800 + i*10)
        datasets["icu_bed"].append(140 + i)
        datasets["ventilator"].append(60 + i//2)

    return success_response({
        "labels": labels,
        "datasets": datasets
    })

@analytics_bp.route('/export', methods=['GET'])
@jwt_required()
@custom_role_required('authority', 'system_admin')
def export_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['date', 'hospital_name', 'zone', 'general_bed_available', 'icu_bed_available', 'ventilator_available'])
    
    hospitals = Hospital.query.all()
    for h in hospitals:
        res = {r.resource_type: r.available_count for r in h.resources}
        writer.writerow([
            datetime.utcnow().strftime("%Y-%m-%d"),
            h.name,
            h.zone,
            res.get('general_bed', 0),
            res.get('icu_bed', 0),
            res.get('ventilator', 0)
        ])
    
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = f"attachment; filename=medigrid_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"
    response.headers["Content-type"] = "text/csv"
    return response
