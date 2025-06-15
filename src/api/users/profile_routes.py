from flask import request, jsonify
from models.user import User
from models.student import Student
from config import Base
from werkzeug.security import check_password_hash, generate_password_hash
from api.utils.auth_helpers import token_required


def profile_routes(bp):
    # Get current user profile
    @bp.route('', methods=['GET'])
    @token_required
    def get_profile(current_user):
        user_data = {
            'id': current_user.id,
            'email': current_user.email,
            'first_name': current_user.first_name,
            'name': current_user.name,
            'role': current_user.role.name
        }

        # If student, include additional student info
        if current_user.role.name == 'student':
            student = Student.query.filter_by(user_id=current_user.id).first()
            if student:
                user_data['user_id'] = student.user_id
                user_data['class_id'] = student.class_id

        return jsonify({'user': user_data}), 200

    # Update current user profile
    @bp.route('', methods=['PUT'])
    @token_required
    def update_profile(current_user):
        data = request.get_json()

        # Update user fields
        if 'first_name' in data:
            current_user.first_name = data['first_name']
        if 'last_name' in data:
            current_user.name = data['last_name']

        # Change password
        if 'current_password' in data and 'new_password' in data:
            if not check_password_hash(current_user.password, data['current_password']):
                return jsonify({'error': 'Current password is incorrect'}), 400

            if len(data['new_password']) < 8:
                return jsonify({'error': 'Password must be at least 8 characters'}), 400

            current_user.password = generate_password_hash(
                data['new_password'])

        # Save changes
        try:
            Base.session.commit()
            return jsonify({'success': True, 'message': 'Profile updated successfully'}), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({'error': f'Database error: {str(e)}'}), 500
