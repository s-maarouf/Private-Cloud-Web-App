from flask import jsonify, request, Blueprint
from models.lab import Lab
from config import db

labs_bp = Blueprint('labs', __name__)


@labs_bp.route('/api/lab/<int:lab_id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def handle_labs(lab_id):
    lab = Lab.query.get(lab_id)

    if not lab:
        return jsonify({'error': 'Lab not found'}), 404

    if request.method == 'GET':
        return jsonify([{
            'id': lab.id,
            'name': lab.name,
            'description': lab.description,
            'status': lab.status
        }])

    if request.method == 'POST':
        data = request.get_json()
        new_lab = Lab(
            name=data['name'],
            description=data.get('description', ''),
            course_id=data['course_id'],
            created_by=data['teacher_id'],
        )
        db.session.add(new_lab)
        db.session.commit()
        return jsonify({'message': 'Lab creation request submitted'})
    if request.method == 'PUT':
        data = request.get_json()
        lab.name = data.get('name', lab.name)
        lab.description = data.get('description', lab.description)
        lab.status = data.get('status', lab.status)

        db.session.commit()
        return jsonify({'message': 'Lab updated successfully'})
    if request.method == 'DELETE':
        db.session.delete(lab)
        db.session.commit()
        return jsonify({'message': 'Lab deleted successfully'})
