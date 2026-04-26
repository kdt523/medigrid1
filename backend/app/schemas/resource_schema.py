from marshmallow import Schema, fields

class ResourceSchema(Schema):
    resource_id = fields.UUID()
    hospital_id = fields.UUID()
    resource_type = fields.Str()
    total_count = fields.Int()
    available_count = fields.Int()
    last_updated = fields.DateTime()
    updated_by = fields.UUID()

resource_schema = ResourceSchema()
resources_schema = ResourceSchema(many=True)

class ResourceUpdateSchema(Schema):
    action = fields.Str()
    new_value = fields.Dict()
    old_value = fields.Dict()
    timestamp = fields.DateTime(attribute="created_at")
    user = fields.Method("get_user")

    def get_user(self, obj):
        return obj.user.name if obj.user else "System"

resource_update_schema = ResourceUpdateSchema()
resource_updates_schema = ResourceUpdateSchema(many=True)
