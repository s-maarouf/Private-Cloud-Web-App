from flask import request, jsonify, Blueprint
from models.user import db, User
from models.subject import StudentSubject, Subject
from models.group import Class, teacherclass
from config import db
import jwt
import datetime
import os

register_bp = Blueprint('register_bp', __name__)
login_bp = Blueprint('login_bp', __name__)


@register_bp.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        required_fields = ['email', 'password',
                           'first_name', 'last_name', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'error': 'Email already registered'
            }), 400

        valid_roles = ['student', 'teacher']
        if data['role'] not in valid_roles:
            return jsonify({
                'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'
            }), 400

        new_user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
        )
        new_user.set_password(data['password'])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'Registration successful',
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name,
                'role': new_user.role,
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': f'Registration failed: {str(e)}'
        }), 500


@login_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data['email']).first()

    # Check if user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
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


    # Generate JWT token
    token = jwt.encode(
        {
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        os.getenv('JWT_SECRET_KEY'),
        algorithm='HS256'
    )

    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': 'étudiant' if user.role == 'student' else 'enseignant' if user.role == 'teacher' else user.role,
            'subjects': [{
                'id': subject.id,
                'name': subject.name,
                'teacher': subject.teacher_name,
                'description': subject.description
            } for subject in subjects],
            'classes': [{
                'id': cls.id,
                'name': cls.name,
                'description': cls.description
            } for cls in classes]
        }
    }), 200
