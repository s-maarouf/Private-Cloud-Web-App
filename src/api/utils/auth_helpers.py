from flask import request, jsonify
from models.user import User
import jwt
import os
from functools import wraps


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check for token in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, os.getenv(
                'JWT_SECRET_KEY', 'default_secret'), algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()

            if not current_user:
                return jsonify({'error': 'Invalid user token'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Pass the current user to the route function
        return f(current_user, *args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role.name != 'administrator':
            return jsonify({'error': 'Admin privileges required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated


def teacher_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role.name not in ['administrator', 'teacher']:
            return jsonify({'error': 'Teacher privileges required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated
