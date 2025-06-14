from flask import request, jsonify, Blueprint
from models.subject import StudentSubject, Subject
from models.group import Class, teacherclass
from models.user import User
from config import db
import jwt

users_bp = Blueprint('users', __name__)
profile_bp = Blueprint('profile', __name__)


@users_bp.route('/api/user/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_user(user_id):
    user = User.query.get(user_id)
    subjects = db.session.query(Subject).join(
        StudentSubject, Subject.id == StudentSubject.subject_id
    ).filter(
        StudentSubject.student_id == user.id
    ).all()
    classes = db.session.query(Class).join(
        teacherclass, Class.id == teacherclass.class_id
    ).filter(
        teacherclass.teacher_id == user.id
    ).all()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if request.method == 'GET':
        return jsonify({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'subjects': [{
                'id': subject.id,
                'name': subject.name,
                'description': subject.description
            } for subject in subjects],
            'classes': [{ 
                'id': cls.id,
                'name': cls.name,
                'description': cls.description
            } for cls in classes]
        })

    if request.method == 'PUT':
        data = request.get_json()
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.role = data.get('role', user.role)

        db.session.commit()
        return jsonify({'message': 'User updated successfully'})

    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})


@profile_bp.route('/api/profile', methods=['GET'])
def get_profile():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'success': False, 'message': 'Token is missing'}), 401

    try:
        # Remove "Bearer " prefix if present
        if token.startswith('Bearer '):
            token = token[7:]

        data = jwt.decode(token, algorithms=["HS256"])
        user = User.query.filter_by(id=data['user_id']).first()

        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role
            }
        }), 200

    except:
        return jsonify({'success': False, 'message': 'Invalid token'}), 401
