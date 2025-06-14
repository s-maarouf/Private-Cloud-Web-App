from flask import Blueprint, request, jsonify
from config import db
from models.group import Class, teacherclass

class_bp = Blueprint('class_bp', __name__)

# Create a new class
@class_bp.route('/api/class', methods=['POST'])
def create_class():
    data = request.get_json()
    if 'name' not in data:
        return jsonify({'error': 'Class name is required'}), 400

    new_class = Class(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(new_class)
    db.session.commit()

    return jsonify({'message': 'Class created successfully', 'id': new_class.id}), 201

# Get all classes
@class_bp.route('/api/class', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    return jsonify([
        {
            'id': cls.id,
            'name': cls.name,
            'description': cls.description,
            'created_at': cls.created_at
        } for cls in classes
    ])

# Get a specific class by ID
@class_bp.route('/api/class/<int:class_id>', methods=['GET'])
def get_class(class_id):
    cls = Class.query.get(class_id)
    if not cls:
        return jsonify({'error': 'Class not found'}), 404

    return jsonify({
        'id': cls.id,
        'name': cls.name,
        'description': cls.description,
        'created_at': cls.created_at
    })

# Update a class
@class_bp.route('/api/class/<int:class_id>', methods=['PUT'])
def update_class(class_id):
    cls = Class.query.get(class_id)
    if not cls:
        return jsonify({'error': 'Class not found'}), 404

    data = request.get_json()
    cls.name = data.get('name', cls.name)
    cls.description = data.get('description', cls.description)

    db.session.commit()
    return jsonify({'message': 'Class updated successfully'})

# Delete a class
@class_bp.route('/api/class/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    cls = Class.query.get(class_id)
    if not cls:
        return jsonify({'error': 'Class not found'}), 404

    db.session.delete(cls)
    db.session.commit()
    return jsonify({'message': 'Class deleted successfully'})
