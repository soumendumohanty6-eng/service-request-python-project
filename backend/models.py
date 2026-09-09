from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ServiceRequest(db.Model):
    __tablename__ = "ServiceRequest"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    requestType = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime(timezone=True), nullable=False,
                          default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "requestType": self.requestType,
            "description": self.description,
            "createdAt": self.createdAt.isoformat() if self.createdAt else None
        }
