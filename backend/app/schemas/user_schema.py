from marshmallow import Schema, fields

class UserSchema(Schema):
    user_id = fields.UUID()
    name = fields.Str()
    email = fields.Email()
    role = fields.Str()
    hospital_id = fields.UUID()
    status = fields.Str()
    last_login = fields.DateTime()
    created_at = fields.DateTime()

user_schema = UserSchema()
users_schema = UserSchema(many=True)
