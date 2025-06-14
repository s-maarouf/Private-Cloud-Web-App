from flask import request, jsonify
from models.lab import Lab, LabStatus
from models.user import Role
from models.subject import Subject
from config import Base
from datetime import datetime
from api.utils.auth_helpers import token_required, admin_required, teacher_required


def labs_routes(bp):
    # Get all labs
    @bp.route('', methods=['GET'])
    @token_required
    def get_all_labs(current_user):
        # Filter by subject_id if provided
        subject_id = request.args.get('subject_id')
        query = Lab.query

        if subject_id:
            query = query.filter_by(subject_id=subject_id)

        labs = query.all()
        labs_list = []

        for lab in labs:
            labs_list.append({
                "id": lab.id,
                "name": lab.name,
                "subject_id": lab.subject_id,
                "created_by": lab.created_by,
                "status": lab.status.value,
                "creation_date": lab.creation_date.isoformat(),
                "approval_date": lab.approval_date.isoformat() if lab.approval_date else None
            })

        return jsonify({"labs": labs_list}), 200

    # Get lab by ID
    @bp.route('/<int:lab_id>', methods=['GET'])
    @token_required
    def get_lab(current_user, lab_id):
        lab = Lab.query.get(lab_id)
        if not lab:
            return jsonify({"error": "Lab not found"}), 404

        lab_data = {
            "id": lab.id,
            "name": lab.name,
            "subject_id": lab.subject_id,
            "created_by": lab.created_by,
            "status": lab.status.value,
            "creation_date": lab.creation_date.isoformat(),
            "approval_date": lab.approval_date.isoformat() if lab.approval_date else None,
            "description": lab.description if hasattr(lab, 'description') else None,
            "instructions": lab.instructions if hasattr(lab, 'instructions') else None
        }

        return jsonify(lab_data), 200

    # Create a new lab (teacher only)
    @bp.route('', methods=['POST'])
    @token_required
    @teacher_required
    def create_lab(current_user):
        data = request.get_json()

        # Validate required fields
        if 'name' not in data or 'subject_id' not in data:
            return jsonify({"error": "Name and subject_id are required"}), 400

        # Check if subject exists
        subject = Subject.query.get(data['subject_id'])
        if not subject:
            return jsonify({"error": "Subject not found"}), 404

        # Create new lab
        new_lab = Lab(
            name=data['name'],
            subject_id=data['subject_id'],
            created_by=current_user.id,
            status=LabStatus.pending,
            creation_date=datetime.utcnow(),
            description=data.get('description'),
            instructions=data.get('instructions')
        )

        # Save to database
        try:
            Base.session.add(new_lab)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Lab created successfully",
                "lab_id": new_lab.id
            }), 201
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Update lab (teacher only, if created by them or admin)
    @bp.route('/<int:lab_id>', methods=['PUT'])
    @token_required
    def update_lab(current_user, lab_id):
        lab = Lab.query.get(lab_id)
        if not lab:
            return jsonify({"error": "Lab not found"}), 404

        # Only creator or admin can update labs
        if lab.created_by != current_user.id and current_user.role != Role.administrator:
            return jsonify({"error": "Unauthorized access"}), 403

        data = request.get_json()

        # Update lab fields
        if 'name' in data:
            lab.name = data['name']
        if 'description' in data:
            lab.description = data['description']
        if 'instructions' in data:
            lab.instructions = data['instructions']

        # Only admin can change the subject
        if 'subject_id' in data and current_user.role == Role.administrator:
            subject = Subject.query.get(data['subject_id'])
            if not subject:
                return jsonify({"error": "Subject not found"}), 404
            lab.subject_id = data['subject_id']

        # Save changes
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Lab updated successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Update lab status (admin only)
    @bp.route('/<int:lab_id>/status', methods=['PUT'])
    @token_required
    @admin_required
    def update_lab_status(current_user, lab_id):
        lab = Lab.query.get(lab_id)
        if not lab:
            return jsonify({"error": "Lab not found"}), 404

        data = request.get_json()

        if 'status' not in data:
            return jsonify({"error": "Status is required"}), 400

        try:
            if data['status'] == 'approved':
                lab.status = LabStatus.approved
                lab.approval_date = datetime.utcnow()
            elif data['status'] == 'rejected':
                lab.status = LabStatus.rejected
            elif data['status'] == 'pending':
                lab.status = LabStatus.pending
                lab.approval_date = None
            else:
                return jsonify({"error": "Invalid status"}), 400
        except ValueError:
            return jsonify({"error": "Invalid status"}), 400

        # Save changes
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Lab status updated successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Delete lab (admin only)
    @bp.route('/<int:lab_id>', methods=['DELETE'])
    @token_required
    @admin_required
    def delete_lab(current_user, lab_id):
        lab = Lab.query.get(lab_id)
        if not lab:
            return jsonify({"error": "Lab not found"}), 404

        try:
            Base.session.delete(lab)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Lab deleted successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
