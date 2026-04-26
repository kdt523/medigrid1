from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.hospital import Hospital
from app.models.resource import Resource
from app.models.user import User
from app.extensions import db
from app.schemas.hospital_schema import hospital_schema, hospitals_schema
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response
from app.services.audit_service import log_action

hospitals_bp = Blueprint('hospitals', __name__)

@hospitals_bp.route('', methods=['GET'])
@jwt_required()
def get_hospitals():
    zone = request.args.get('zone')
    h_type = request.args.get('type')
    status = request.args.get('status')
    search = request.args.get('search')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = Hospital.query

    if zone and zone != 'All Zones':
        query = query.filter_by(zone=zone)
    if h_type and h_type != 'All Types':
        query = query.filter(Hospital.type.ilike(h_type))
    if status and status != 'All':
        query = query.filter_by(status=status.lower())
    if search:
        query = query.filter(Hospital.name.ilike(f"%{search}%"))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return success_response({
        "hospitals": hospitals_schema.dump(pagination.items),
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page
    })

@hospitals_bp.route('/<hospital_id>', methods=['GET'])
@jwt_required()
def get_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    return success_response(hospital_schema.dump(hospital))

@hospitals_bp.route('', methods=['POST'])
@jwt_required()
@role_required('system_admin')
def create_hospital():
    data = request.get_json()
    user_id = get_jwt_identity()

    try:
        hospital = Hospital(
            name=data['name'],
            zone=data['zone'],
            type=data['type'],
            address=data['address'],
            contact=data.get('contact'),
            email=data.get('email'),
            lat=data.get('lat'),
            lng=data.get('lng')
        )
        db.session.add(hospital)
        db.session.flush() # Get hospital_id

        # Create default resources
        for r_type in ['general_bed', 'icu_bed', 'ventilator']:
            total = data.get(f'{r_type}_total', 0)
            res = Resource(
                hospital_id=hospital.hospital_id,
                resource_type=r_type,
                total_count=total,
                available_count=total # Initial available = total
            )
            db.session.add(res)

        db.session.commit()
        log_action(user_id, "CREATE", "hospital", hospital.hospital_id, new_value=hospital_schema.dump(hospital))
        
        return success_response(hospital_schema.dump(hospital), "Hospital created", 201)
    except Exception as e:
        db.session.rollback()
        return error_response(str(e))

@hospitals_bp.route('/<hospital_id>', methods=['PUT'])
@jwt_required()
@role_required('system_admin')
def update_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    data = request.get_json()
    user_id = get_jwt_identity()
    
    old_val = hospital_schema.dump(hospital)
    
    hospital.name = data.get('name', hospital.name)
    hospital.zone = data.get('zone', hospital.zone)
    hospital.type = data.get('type', hospital.type)
    hospital.address = data.get('address', hospital.address)
    hospital.contact = data.get('contact', hospital.contact)
    hospital.email = data.get('email', hospital.email)
    hospital.lat = data.get('lat', hospital.lat)
    hospital.lng = data.get('lng', hospital.lng)
    hospital.status = data.get('status', hospital.status)

    # Update resource totals if provided
    for r_type in ['general_bed', 'icu_bed', 'ventilator']:
        key = f'{r_type}_total'
        if key in data:
            new_total = int(data[key])
            resource = Resource.query.filter_by(
                hospital_id=hospital.hospital_id,
                resource_type=r_type
            ).first()
            if resource:
                resource.total_count = new_total
                # Cap available_count to new total to avoid constraint violation
                if resource.available_count > new_total:
                    resource.available_count = new_total
            else:
                # Create if missing
                resource = Resource(
                    hospital_id=hospital.hospital_id,
                    resource_type=r_type,
                    total_count=new_total,
                    available_count=new_total
                )
                db.session.add(resource)

    db.session.commit()
    log_action(user_id, "UPDATE", "hospital", hospital.hospital_id, old_value=old_val, new_value=hospital_schema.dump(hospital))
    
    return success_response(hospital_schema.dump(hospital), "Hospital updated")


@hospitals_bp.route('/<hospital_id>', methods=['DELETE'])
@jwt_required()
@role_required('system_admin')
def delete_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    user_id = get_jwt_identity()
    
    hospital.status = 'inactive'
    db.session.commit()
    
    log_action(user_id, "DELETE", "hospital", hospital.hospital_id, old_value={"status": "active"}, new_value={"status": "inactive"})
    
    return success_response(None, "Hospital deactivated")
