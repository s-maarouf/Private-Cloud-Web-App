from flask import Flask, jsonify
from flask_cors import CORS
from config import Base, SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from api import register_bp, login_bp, courses_bp, labs_bp, users_bp, profile_bp, subjects_bp, class_bp
import os
from swagger import swagger_ui_blueprint, get_swagger_json

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure the app
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_key_for_development')
    
    # Initialize SQLAlchemy
    Base.init_app(app)
    
    # Register API blueprints
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(labs_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(subjects_bp)
    app.register_blueprint(class_bp)
    
    # Register Swagger UI blueprint
    app.register_blueprint(swagger_ui_blueprint, url_prefix='/api/docs')
    
    # Define route for Swagger JSON
    @app.route('/api/swagger.json')
    def swagger():
        return get_swagger_json()
    
    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        Base.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)