import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db, ServiceRequest

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
Migrate(app, db)
CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})

ALLOWED_TYPES = {"Lead Generation", "Email Campaign", "Social Campaign", "Other"}
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

@app.get("/api/health")
def health():
    return jsonify(success=True, message="Backend is running"), 200

@app.post("/api/service-requests")
def create_request():
    try:
        data = request.get_json(silent=True) or {}
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        request_type = str(data.get("requestType", "")).strip()
        description = str(data.get("description", "")).strip()

        if not all([name, email, request_type, description]):
            return jsonify(success=False, message="All fields are required."), 400
        if not EMAIL_RE.match(email):
            return jsonify(success=False, message="Please provide a valid email address."), 400
        if request_type not in ALLOWED_TYPES:
            return jsonify(success=False, message="Invalid request type."), 400

        record = ServiceRequest(name=name, email=email,
                                requestType=request_type, description=description)
        db.session.add(record)
        db.session.commit()
        return jsonify(success=True, message="Request created successfully"), 201
    except Exception:
        db.session.rollback()
        return jsonify(success=False, message="Internal server error"), 500

@app.get("/api/service-requests")
def get_requests():
    try:
        records = ServiceRequest.query.order_by(ServiceRequest.createdAt.desc()).all()
        return jsonify(success=True, data=[r.to_dict() for r in records]), 200
    except Exception:
        return jsonify(success=False, message="Internal server error"), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=app.config["PORT"], debug=True)
