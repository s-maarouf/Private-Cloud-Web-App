from flask import request, jsonify
from models.class_group import ClassGroup
from models.student import Student
from models.user import User, Role
from models.class_subject import ClassSubject
from models.teacher_assignment import TeacherAssignment
from models.subject import Subject
from config import Base
from api.utils.auth_helpers import token_required, admin_required


def class_routes(bp):
    # Get all classes
    @bp.route('', methods=['GET'])
    @token_required
    def get_all_classes(current_user):
        classes = ClassGroup.query.all()
        classes_list = []

        for class_group in classes:
            classes_list.append({
                "id": class_group.id,
                "name": class_group.name
            })

        return jsonify({"classes": classes_list}), 200

    # Get class by ID with students and subjects
    @bp.route('/<int:class_id>', methods=['GET'])
    @token_required
    def get_class(current_user, class_id):
        class_group = ClassGroup.query.get(class_id)
        if not class_group:
            return jsonify({"error": "Class not found"}), 404

        # Get students in this class
        students = Student.query.filter_by(class_id=class_id).all()
        students_list = []

        for student in students:
            user = User.query.get(student.user_id)
            if user:
                students_list.append({
                    "id": student.id,
                    "user_id": student.user_id,
                    "name": user.name,
                    "first_name": user.first_name,
                    "email": user.username
                })

        # Get subjects for this class
        class_subjects = ClassSubject.query.filter_by(class_id=class_id).all()
        subjects_list = []

        for cs in class_subjects:
            subject = Subject.query.get(cs.subject_id)
            if subject:
                # Get teacher assignment for this class subject
                teacher_assignment = TeacherAssignment.query.filter_by(
                    class_subject_id=cs.id
                ).first()

                teacher_data = None
                if teacher_assignment:
                    teacher = User.query.get(teacher_assignment.teacher_id)
                    if teacher:
                        teacher_data = {
                            "id": teacher.id,
                            "name": teacher.name,
                            "first_name": teacher.first_name
                        }

                subjects_list.append({
                    "id": subject.id,
                    "name": subject.name,
                    "teacher": teacher_data
                })

        return jsonify({
            "id": class_group.id,
            "name": class_group.name,
            "students": students_list,
            "subjects": subjects_list
        }), 200

    # Create a new class (admin only)
    @bp.route('', methods=['POST'])
    @token_required
    @admin_required
    def create_class(current_user):
        data = request.get_json()

        if 'name' not in data:
            return jsonify({"error": "Class name is required"}), 400

        # Check if class already exists
        existing_class = ClassGroup.query.filter_by(name=data['name']).first()
        if existing_class:
            return jsonify({"error": "Class with this name already exists"}), 409

        # Create new class
        new_class = ClassGroup(
            name=data['name']
        )

        # Save to database
        try:
            Base.session.add(new_class)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Class created successfully",
                "class_id": new_class.id
            }), 201
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Update class details (admin only)
    @bp.route('/<int:class_id>', methods=['PUT'])
    @token_required
    @admin_required
    def update_class(current_user, class_id):
        data = request.get_json()

        if 'name' not in data:
            return jsonify({"error": "Class name is required"}), 400

        class_group = ClassGroup.query.get(class_id)
        if not class_group:
            return jsonify({"error": "Class not found"}), 404
        # Check if class name already exists
        existing_class = ClassGroup.query.filter_by(name=data['name']).first()
        if existing_class and existing_class.id != class_id:
            return jsonify({"error": "Class with this name already exists"}), 409
        # Update class details
        class_group.name = data['name']
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Class updated successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Delete a class (admin only)
    @bp.route('/<int:class_id>', methods=['DELETE'])
    @token_required
    @admin_required
    def delete_class(current_user, class_id):
        data = request.get_json()

        if 'class_id' not in data:
            return jsonify({"error": "Class ID is required"}), 400

        class_group = ClassGroup.query.get(data['id'])
        if not class_group:
            return jsonify({"error": "Class not found"}), 404

        try:
            # Remove all students from this class
            students = Student.query.filter_by(class_id=class_group.id).all()
            for student in students:
                Base.session.delete(student)
            # Remove all class-subject links
            class_subjects = ClassSubject.query.filter_by(
                class_id=class_group.id).all()
            for cs in class_subjects:
                # Remove all teacher assignments for this class-subject
                teacher_assignments = TeacherAssignment.query.filter_by(
                    class_subject_id=cs.id).all()
                for ta in teacher_assignments:
                    Base.session.delete(ta)
                Base.session.delete(cs)
            # Finally, delete the class group itself
            Base.session.delete(class_group)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Class deleted successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Get students for a specific class
    @bp.route('/<int:class_id>/students', methods=['GET'])
    @token_required
    def get_class_students(current_user, class_id):
        class_group = ClassGroup.query.get(class_id)
        if not class_group:
            return jsonify({"error": "Class not found"}), 404

        # Get students in this class
        students = Student.query.filter_by(class_id=class_id).all()
        students_list = []

        for student in students:
            user = User.query.get(student.user_id)
            if user:
                students_list.append({
                    "user_id": student.user_id,
                    "name": user.name,
                    "first_name": user.first_name,
                    "email": user.email
                })

        return jsonify({"students": students_list}), 200

    # Add a student to a class

    @bp.route('/<int:class_id>/students', methods=['POST'])
    @token_required
    @admin_required
    def add_student_to_class(current_user, class_id):
        class_group = ClassGroup.query.get(class_id)
        if not class_group:
            return jsonify({"error": "Class not found"}), 404

        data = request.get_json()

        if 'user_id' not in data:
            return jsonify({"error": "User ID is required"}), 400

        # Check if user exists and is a student
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.role != Role.student:
            return jsonify({"error": "User is not a student"}), 400

        # Check if student record already exists
        existing_student = Student.query.filter_by(
            user_id=data['user_id']).first()
        if existing_student:
            if existing_student.class_id == class_id:
                return jsonify({"error": "Student already in this class"}), 409
            existing_student.class_id = class_id
        else:
            # Create student record
            student = Student(
                user_id=data['user_id'],
                class_id=class_id
            )
            Base.session.add(student)

        # Save changes
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Student added to class successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Remove a student from a class
    @bp.route('/<int:class_id>/students/<int:student_id>', methods=['DELETE'])
    @token_required
    @admin_required
    def remove_student_from_class(current_user, class_id, student_id):
        student = Student.query.get(student_id)
        if not student or student.class_id != class_id:
            return jsonify({"error": "Student not found in this class"}), 404

        try:
            Base.session.delete(student)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Student removed from class successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Get subjects for a specific class

    @bp.route('/<int:class_id>/subjects', methods=['GET'])
    @token_required
    def get_class_subjects(current_user, class_id):
        class_group = ClassGroup.query.get(class_id)
        if not class_group:
            return jsonify({"error": "Class not found"}), 404

        # Get subjects for this class
        class_subjects = ClassSubject.query.filter_by(class_id=class_id).all()
        subjects_list = []

        for cs in class_subjects:
            subject = Subject.query.get(cs.subject_id)
            if subject:
                # Get teacher assignment for this class subject
                # Use the actual primary key of ClassSubject for filtering
                # This depends on your database schema - check what columns are available
                teacher_assignment = TeacherAssignment.query.filter_by(
                    class_id=cs.class_id,
                    subject_id=cs.subject_id
                ).first()

                teacher_data = None
                if teacher_assignment:
                    teacher = User.query.get(teacher_assignment.teacher_id)
                    if teacher:
                        teacher_data = {
                            "id": teacher.id,
                            "name": teacher.name,
                            "first_name": teacher.first_name
                        }

                subjects_list.append({
                    "id": subject.id,
                    "name": subject.name,
                    "teacher": teacher_data
                })

        return jsonify({"subjects": subjects_list}), 200

    # Add a subject to a class

    @bp.route('/<int:class_id>/subjects', methods=['POST'])
    @token_required
    @admin_required
    def add_subject_to_class(current_user, class_id):
        class_group = ClassGroup.query.get(class_id)
        if not class_group:
            return jsonify({"error": "Class not found"}), 404

        data = request.get_json()

        if 'subject_id' not in data:
            return jsonify({"error": "Subject ID is required"}), 400

        # Check if subject exists
        subject = Subject.query.get(data['subject_id'])
        if not subject:
            return jsonify({"error": "Subject not found"}), 404

        # Check if class-subject link already exists
        existing_cs = ClassSubject.query.filter_by(
            class_id=class_id,
            subject_id=data['subject_id']
        ).first()

        if existing_cs:
            return jsonify({"error": "Subject already added to this class"}), 409

        # Create class-subject link
        class_subject = ClassSubject(
            class_id=class_id,
            subject_id=data['subject_id']
        )

        # Save to database
        try:
            Base.session.add(class_subject)
            Base.session.commit()

            # If teacher_id is provided, assign teacher
            if 'teacher_id' in data:
                teacher = User.query.get(data['teacher_id'])
                if not teacher or teacher.role != Role.teacher:
                    return jsonify({"error": "Invalid teacher ID"}), 400

                teacher_assignment = TeacherAssignment(
                    teacher_id=data['teacher_id'],
                    class_subject_id=class_subject.id
                )

                Base.session.add(teacher_assignment)
                Base.session.commit()

            return jsonify({
                "success": True,
                "message": "Subject added to class successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Remove a subject from a class
    @bp.route('/<int:class_id>/subjects/<int:subject_id>', methods=['DELETE'])
    @token_required
    @admin_required
    def remove_subject_from_class(current_user, class_id, subject_id):
        class_subject = ClassSubject.query.filter_by(
            class_id=class_id,
            subject_id=subject_id
        ).first()

        if not class_subject:
            return jsonify({"error": "Subject not found in this class"}), 404

        try:
            # Remove all teacher assignments for this class-subject first
            teacher_assignments = TeacherAssignment.query.filter_by(
                class_id=class_id,
                subject_id=subject_id
            ).all()

            for ta in teacher_assignments:
                Base.session.delete(ta)

            Base.session.delete(class_subject)
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Subject removed from class successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Assign a teacher to a class subject
    @bp.route('/<int:class_id>/teachers', methods=['POST'])
    @token_required
    @admin_required
    def assign_teacher(current_user, class_id):
        data = request.get_json()

        if 'teacher_id' not in data or 'subject_id' not in data:
            return jsonify({"error": "Teacher ID and Subject ID are required"}), 400

        # Check if teacher exists and has teacher role
        teacher = User.query.get(data['teacher_id'])
        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404

        if teacher.role != Role.teacher:
            return jsonify({"error": "User is not a teacher"}), 400

        # Check if class-subject exists
        class_subject = ClassSubject.query.filter_by(
            class_id=class_id,
            subject_id=data['subject_id']
        ).first()

        if not class_subject:
            return jsonify({"error": "Subject not found for this class"}), 404

        # Check if assignment already exists
        existing_assignment = TeacherAssignment.query.filter_by(
            class_id=class_id,
            subject_id=data['subject_id']
        ).first()

        if existing_assignment:
            existing_assignment.teacher_id = data['teacher_id']
        else:
            # Create new assignment
            assignment = TeacherAssignment(
                teacher_id=data['teacher_id'],
                class_id=class_id,
                subject_id=data['subject_id']
            )
            Base.session.add(assignment)

        # Save changes
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Teacher assigned successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
