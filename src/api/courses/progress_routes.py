from flask import request, jsonify
from models.student_lab_progress import StudentLabProgress, ProgressStatus
from models.student import Student
from models.lab import Lab
from models.user import Role, User
from config import Base
from api.utils.auth_helpers import token_required
from datetime import datetime


def progress_routes(bp):
    # Get progress for a student
    @bp.route('/students/<int:student_id>/progress', methods=['GET'])
    @token_required
    def get_student_progress(current_user, student_id):
        # Check if student exists
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Teachers can only view their own students, students can only view their own progress
        if current_user.role == Role.student and current_user.id != student.user_id:
            return jsonify({"error": "Unauthorized access"}), 403

        # Get all progress entries for this student
        progress_entries = StudentLabProgress.query.filter_by(
            student_id=student_id).all()
        progress_list = []

        for entry in progress_entries:
            lab = Lab.query.get(entry.lab_id)
            if lab:
                progress_list.append({
                    "id": entry.id,
                    "lab_id": entry.lab_id,
                    "lab_name": lab.name,
                    "status": entry.status.value,
                    "start_date": entry.start_date.isoformat() if entry.start_date else None,
                    "completion_date": entry.completion_date.isoformat() if entry.completion_date else None,
                    "score": entry.score,
                    "comments": entry.comments
                })

        return jsonify({"progress": progress_list}), 200

    # Update student progress for a lab
    @bp.route('/students/<int:student_id>/labs/<int:lab_id>/progress', methods=['POST'])
    @token_required
    def update_lab_progress(current_user, student_id, lab_id):
        # Check if student exists
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Check if lab exists
        lab = Lab.query.get(lab_id)
        if not lab:
            return jsonify({"error": "Lab not found"}), 404

        # Students can only update their own progress
        if current_user.role == Role.student and current_user.id != student.user_id:
            return jsonify({"error": "Unauthorized access"}), 403

        data = request.get_json()

        # Get existing progress or create new entry
        progress = StudentLabProgress.query.filter_by(
            student_id=student_id,
            lab_id=lab_id
        ).first()

        if not progress:
            progress = StudentLabProgress(
                student_id=student_id,
                lab_id=lab_id,
                status=ProgressStatus.in_progress,
                start_date=datetime.utcnow()
            )
            Base.session.add(progress)

        # Update progress fields
        if 'status' in data:
            try:
                if data['status'] == 'not_started':
                    progress.status = ProgressStatus.not_started
                elif data['status'] == 'in_progress':
                    progress.status = ProgressStatus.in_progress
                    if not progress.start_date:
                        progress.start_date = datetime.utcnow()
                elif data['status'] == 'completed':
                    progress.status = ProgressStatus.completed
                    if not progress.completion_date:
                        progress.completion_date = datetime.utcnow()
                else:
                    return jsonify({"error": "Invalid status"}), 400
            except ValueError:
                return jsonify({"error": "Invalid status"}), 400

        # Only teachers can update scores
        if 'score' in data and current_user.role in [Role.teacher, Role.administrator]:
            try:
                score = float(data['score'])
                if score < 0 or score > 100:
                    return jsonify({"error": "Score must be between 0 and 100"}), 400
                progress.score = score
            except ValueError:
                return jsonify({"error": "Score must be a number"}), 400

        # Update comments
        if 'comments' in data:
            progress.comments = data['comments']

        # Save changes
        try:
            Base.session.commit()
            return jsonify({
                "success": True,
                "message": "Progress updated successfully"
            }), 200
        except Exception as e:
            Base.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    # Get progress stats for a class (teacher only)
    @bp.route('/classes/<int:class_id>/progress', methods=['GET'])
    @token_required
    def get_class_progress(current_user, class_id):
        # Only teachers and admins can access class progress
        if current_user.role == Role.student:
            return jsonify({"error": "Unauthorized access"}), 403

        # Get all students in the class
        students = Student.query.filter_by(class_id=class_id).all()

        class_progress = {
            "student_count": len(students),
            "lab_completion": {},
            "student_stats": []
        }

        # Calculate stats for each student
        for student in students:
            user = User.query.get(student.user_id)
            if not user:
                continue

            progress_entries = StudentLabProgress.query.filter_by(
                student_id=student.id).all()

            completed = 0
            in_progress = 0
            not_started = 0
            avg_score = 0

            for entry in progress_entries:
                if entry.status == ProgressStatus.completed:
                    completed += 1
                    if entry.score:
                        avg_score += entry.score
                elif entry.status == ProgressStatus.in_progress:
                    in_progress += 1
                else:
                    not_started += 1

                # Aggregate lab completion data
                if entry.lab_id not in class_progress["lab_completion"]:
                    class_progress["lab_completion"][entry.lab_id] = {
                        "lab_id": entry.lab_id,
                        "completed": 0,
                        "in_progress": 0,
                        "not_started": 0
                    }

                if entry.status == ProgressStatus.completed:
                    class_progress["lab_completion"][entry.lab_id]["completed"] += 1
                elif entry.status == ProgressStatus.in_progress:
                    class_progress["lab_completion"][entry.lab_id]["in_progress"] += 1
                else:
                    class_progress["lab_completion"][entry.lab_id]["not_started"] += 1

            # Calculate average score
            if completed > 0:
                avg_score /= completed

            student_stats = {
                "student_id": student.id,
                "user_id": student.user_id,
                "name": f"{user.first_name} {user.name}",
                "email": user.username,
                "completed": completed,
                "in_progress": in_progress,
                "not_started": not_started,
                "avg_score": round(avg_score, 2)
            }

            class_progress["student_stats"].append(student_stats)

        # Convert lab_completion dict to list
        class_progress["lab_completion"] = list(
            class_progress["lab_completion"].values())

        return jsonify(class_progress), 200
