from flask import request, jsonify
from werkzeug.security import check_password_hash
from models.user import User
from datetime import datetime, timedelta
import jwt
import os


def login_routes(bp):
    @bp.route('', methods=['POST'])
    def login():
        auth = request.get_json()

        if not auth or not auth.get('email') or not auth.get('password'):
            return jsonify({'error': 'Authentication credentials are required'}), 400

        user = User.query.filter_by(email=auth.get('email')).first()

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if check_password_hash(user.password, auth.get('password')):
            # Generate token
            token = jwt.encode({
                'user_id': user.id,
                'role': user.role.name,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, os.getenv('JWT_SECRET_KEY', 'default_secret'), algorithm="HS256")

            return jsonify({
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'name': user.name,
                    'role': user.role.name
                }
            }), 200

        return jsonify({'error': 'Invalid email or password'}), 401
