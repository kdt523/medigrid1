from flask import Blueprint, request
from app.models.hospital import Hospital
from app.models.resource import Resource
from app.models.search_log import SearchLog
from app.extensions import db
from app.schemas.hospital_schema import hospital_schema
from app.utils.responses import success_response
import math

search_bp = Blueprint('search', __name__)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@search_bp.route('', methods=['GET'])
def search():
    zone = request.args.get('zone')
    resource_type = request.args.get('resource_type', 'general_bed')
    h_type = request.args.get('type')
    min_available = request.args.get('min_available', 0, type=int)
    query_text = request.args.get('q', '')
    user_lat = request.args.get('lat', type=float)
    user_lng = request.args.get('lng', type=float)

    query = db.session.query(Hospital).join(Resource).filter(Hospital.status == 'active')

    if zone and zone != 'All Zones':
        query = query.filter(Hospital.zone == zone)
    if h_type and h_type != 'All Types':
        query = query.filter(Hospital.type.ilike(h_type))
    if query_text:
        query = query.filter((Hospital.name.ilike(f"%{query_text}%")) | (Hospital.address.ilike(f"%{query_text}%")))
    
    query = query.filter(Resource.resource_type == resource_type)
    query = query.filter(Resource.available_count >= min_available)
    
    # Sort by availability desc
    query = query.order_by(Resource.available_count.desc())
    
    hospitals = query.all()
    results = []
    
    for h in hospitals:
        h_data = hospital_schema.dump(h)
        dist = None
        if user_lat is not None and user_lng is not None and h.lat and h.lng:
            dist = haversine(user_lat, user_lng, float(h.lat), float(h.lng))
        
        h_data['distance_km'] = round(dist, 2) if dist is not None else None
        results.append(h_data)

    # If distance provided, maybe re-sort or just provide distance
    if user_lat is not None and user_lng is not None:
        results.sort(key=lambda x: (x['distance_km'] if x['distance_km'] is not None else 99999))

    # Log search
    log = SearchLog(
        query_text=query_text,
        zone_filter=zone,
        resource_filter=resource_type,
        results_count=len(results)
    )
    db.session.add(log)
    db.session.commit()

    return success_response({
        "results": results,
        "total": len(results)
    })
