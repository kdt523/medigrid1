from flask import jsonify

def success_response(data, message=None, status_code=200):
    response = {"status": "success"}
    if data is not None:
        response["data"] = data
    if message:
        response["message"] = message
    return jsonify(response), status_code

def error_response(message, status_code=400, errors=None):
    response = {
        "status": "error",
        "message": message
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), status_code
