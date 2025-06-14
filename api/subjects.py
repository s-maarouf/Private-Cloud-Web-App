from flask import request, jsonify, Blueprint
from models.user import db, User
from models.subject import Subject, Module, Exercice
from werkzeug.utils import secure_filename
import os

subjects_bp = Blueprint('subjects_bp', __name__)
modules_bp = Blueprint('modules_bp', __name__)

UPLOAD_FOLDER = 'uploads/modules/'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@subjects_bp.route('/api/subject/<int:subject_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_subject(subject_id):
    subject = Subject.query.get(subject_id)

    if not subject:
        return jsonify({'error': 'Subject not found'}), 404

    if request.method == 'GET':
        teacher = User.query.get(subject.teacher_id)
        teacher_name = f"{teacher.first_name} {teacher.last_name}" if teacher else None
        return jsonify({
            'id': subject.id,
            'name': subject.name,
            'description': subject.description,
            'teacher_id': subject.teacher_id,
            'teacher_name': teacher_name
        })

    if request.method == 'PUT':
        data = request.get_json()
        subject.name = data.get('name', subject.name)
        subject.description = data.get('description', subject.description)
        subject.teacher_id = data.get('teacher_id', subject.teacher_id)
        subject.teacher_name = data.get('teacher_name', subject.teacher_name)

        db.session.commit()
        return jsonify({'message': 'Subject updated successfully'})

    if request.method == 'DELETE':
        db.session.delete(subject)
        db.session.commit()
        return jsonify({'message': 'Subject deleted successfully'})


@subjects_bp.route('/api/subject', methods=['POST'])
def create_subject():
    data = request.get_json()

    if 'name' not in data or 'teacher_id' not in data:
        return jsonify({'error': 'Missing required fields: name or teacher_id'}), 400

    teacher = User.query.get(data['teacher_id'])
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    teacher_name = f"{teacher.first_name} {teacher.last_name}"

    new_subject = Subject(
        name=data['name'],
        description=data.get('description', ''),
        teacher_id=data['teacher_id'],
        teacher_name=teacher_name
    )
    db.session.add(new_subject)
    db.session.commit()

    return jsonify({'message': 'Subject created successfully', 'id': new_subject.id}), 201


@modules_bp.route('/api/subject/<int:subject_id>/modules', methods=['POST'])
def add_module(subject_id):
    name = request.form.get('name')
    file = request.files.get('file')
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
    module = Module(name=name, file_path=file_path, subject_id=subject_id)
    db.session.add(module)
    db.session.commit()
    return jsonify({'message': 'Module added', 'id': module.id}), 201


@modules_bp.route('/api/subject/<int:subject_id>/modules', methods=['GET'])
def get_modules(subject_id):
    modules = Module.query.filter_by(subject_id=subject_id).all()
    subject = Subject.query.get(subject_id)
    if not modules:
        return jsonify({'error': 'No modules found for this subject'}), 404
    return jsonify([{
        'id': module.id,
        'name': module.name,
        'subject': subject.name,
        'file_path': module.file_path,
        'created_at': module.created_at.isoformat()
    } for module in modules]), 200


@modules_bp.route('/api/subject/<int:subject_id>/exercices', methods=['POST'])
def add_exercice(subject_id):
    title = request.form.get('title')
    content = request.form.get('content')
    file = request.files.get('file')
    file_path = None
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
    exercice = Exercice(title=title, content=content,
                        file_path=file_path, subject_id=subject_id)
    db.session.add(exercice)
    db.session.commit()
    return jsonify({'message': 'Exercice added', 'id': exercice.id}), 201
