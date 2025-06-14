from flask import request, jsonify, Blueprint
from models.user import db
from models.course import Course

courses_bp = Blueprint('courses_bp', __name__)


@courses_bp.route('/api/course/<int:course_id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def handle_courses(course_id):
    course = Course.query.get(course_id)

    if not course:
        return jsonify({'error': 'Course not found'}), 404

    if request.method == 'GET':
        return jsonify([{
            'id': course.id,
            'name': course.name,
            'description': course.description
        }])

    if request.method == 'POST':
        data = request.get_json()
        new_course = Course(
            name=data['name'],
            description=data.get('description', ''),
            teacher_id=data['teacher_id']
        )
        db.session.add(new_course)
        db.session.commit()
        return jsonify({'message': 'Course created successfully'})
    if request.method == 'PUT':
        data = request.get_json()
        course.name = data.get('name', course.name)
        course.description = data.get('description', course.description)

        db.session.commit()
        return jsonify({'message': 'Course updated successfully'})
    if request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return jsonify({'message': 'Course deleted successfully'})
