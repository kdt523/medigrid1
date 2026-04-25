from marshmallow import Schema, fields

class AlertSchema(Schema):
    alert_id = fields.UUID()
    hospital_id = fields.UUID()
    hospital_name = fields.Method("get_hospital_name")
    resource_type = fields.Str()
    threshold_value = fields.Int()
    current_value = fields.Int()
    triggered_at = fields.DateTime()
    resolved_at = fields.DateTime()
    resolved_by = fields.UUID()
    status = fields.Str()
    severity = fields.Str()

    def get_hospital_name(self, obj):
        return obj.hospital.name if obj.hospital else "Unknown"

alert_schema = AlertSchema()
alerts_schema = AlertSchema(many=True)

class ThresholdSchema(Schema):
    threshold_id = fields.UUID()
    hospital_id = fields.UUID()
    hospital_name = fields.Method("get_hospital_name")
    resource_type = fields.Str()
    min_value = fields.Int()

    def get_hospital_name(self, obj):
        return obj.hospital.name if obj.hospital else "Unknown"

threshold_schema = ThresholdSchema()
thresholds_schema = ThresholdSchema(many=True)
