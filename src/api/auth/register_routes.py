from flask import request, jsonify
from models.user import User, Role
from config import Base
from werkzeug.security import generate_password_hash
import re


def register_routes(bp):
    @bp.route('', methods=['POST'])
    def register():
        data = request.get_json()

        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Validate email format
        email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400

        # Check if email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409

        # Validate password strength
        if len(data['password']) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400

        # Create new user with student role by default
        new_user = User(
            email=data['email'],
            password=generate_password_hash(data['password']),
            role=data.get('role', Role.student),
            name=data['last_name'],
            first_name=data['first_name']
        )

        # Save to database
        try:
            Base.session.add(new_user)
            Base.session.commit()
            return jsonify({'success': True, 'message': 'Registration successful'}), 201
        except Exception as e:
            Base.session.rollback()
            return jsonify({'error': f'Database error: {str(e)}'}), 500
