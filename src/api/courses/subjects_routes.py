from flask import request, jsonify
from models.subject import Subject
from models.user import Role
from config import Base
from api.utils.auth_helpers import token_required, admin_required, teacher_required

def subjects_routes(bp):
    # Get all subjects
    @bp.route('', methods=['GET'])
    @token_required
    def get_all_subjects(current_user):
        subjects = Subject.query.all()
        subjects_list = []

        for subject in subjects:
            subjects_list.append({
                "id": subject.id,
                "name": subject.name
            })

        return jsonify({"subjects": subjects_list}), 200
    
    # Get subject by ID
    @bp.route('/<int:subject_id>', methods=['GET'])
    @token_required
    def get_subject(current_user, subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"error": "Subject not found"}), 404

        return jsonify({
            "id": subject.id,
            "name": subject.name
        }), 200
    
    # Create a new subject (admin or teacher only)
    @bp.route('', methods=['POST'])
    @token_required
    @teacher_required
    def create_subject(current_user):
        data = request.get_json()

        if 'name' not in data:
            return jsonify({"error": "Subject name is required"}), 400

        # Check if subject already exists
        existing_subject = Subject.query.filter_by(name=data['name']).first()
        if existing_subject:
            return jsonify({"error": "Subject with this name already exists"}), 409

        # Create new subject
        new_subject = Subject(
            name=data['name']
        )

        # Save to database
        try:
            Base.session.add(new_subject)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Subject created successfully",
                "subject_id": new_subject.id
            }), 201
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
    
    # Update a subject (admin only)
    @bp.route('/<int:subject_id>', methods=['PUT'])
    @token_required
    @admin_required
    def update_subject(current_user, subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"error": "Subject not found"}), 404
            
        data = request.get_json()
        
        if 'name' not in data:
            return jsonify({"error": "Subject name is required"}), 400
            
        # Check if name already exists for another subject
        existing_subject = Subject.query.filter_by(name=data['name']).first()
        if existing_subject and existing_subject.id != subject_id:
            return jsonify({"error": "Subject with this name already exists"}), 409
            
        # Update subject
        subject.name = data['name']
        
        # Save changes
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Subject updated successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
    
    # Delete a subject (admin only)
    @bp.route('/<int:subject_id>', methods=['DELETE'])
    @token_required
    @admin_required
    def delete_subject(current_user, subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"error": "Subject not found"}), 404
            
        try:
            Base.session.delete(subject)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Subject deleted successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500