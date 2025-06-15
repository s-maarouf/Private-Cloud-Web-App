from flask import request, jsonify
from models.user import User, Role
from models.student import Student
from models.teacher_assignment import TeacherAssignment # Added import
from models.class_group import ClassGroup # Added import
from models.subject import Subject # Added import
from config import Base
from werkzeug.security import generate_password_hash, check_password_hash
from api.utils.auth_helpers import token_required, admin_required


def users_routes(bp):
	# Get all users (admin only)
	@bp.route('', methods=['GET'])
	@token_required
	@admin_required
	def get_all_users(current_user):
		users = User.query.all()
		users_list = []

		for user in users:
			users_list.append({
				'id': user.id,
				'email': user.email,
				'first_name': user.first_name,
				'name': user.name,
				'role': user.role.name
			})

		return jsonify({'users': users_list}), 200

	# Get current user profile
	@bp.route('/profile', methods=['GET'])
	@token_required
	def get_current_user_profile(current_user):
		user_data = {
			'id': current_user.id,
			'email': current_user.email,
			'first_name': current_user.first_name,
			'name': current_user.name,
			'role': current_user.role.name
		}

		# If student, include additional student info
		if current_user.role.name == 'student':
			student = Student.query.filter_by(user_id=current_user.id).first()
			if student:
				user_data['student_id'] = student.id
				user_data['class_id'] = student.class_id

		# If teacher, include assigned classes
		elif current_user.role.name == 'teacher':
			# Get teacher assignments
			assignments = TeacherAssignment.query.filter_by(teacher_id=current_user.id).all()

			# Get unique class IDs from assignments
			class_ids = set()
			for assignment in assignments:
				class_ids.add(assignment.class_id)

			# Get class details
			assigned_classes = []
			for class_id in class_ids:
				class_group = ClassGroup.query.get(class_id)
				if class_group:
					# Get subjects for this class taught by this teacher
					class_subjects = []
					for assignment in assignments:
						if assignment.class_id == class_id:
							subject = Subject.query.get(assignment.subject_id)
							if subject:
								class_subjects.append({
									'id': subject.id,
									'name': subject.name,
								})

					assigned_classes.append({
						'id': class_group.id,
						'name': class_group.name,
						'subjects': class_subjects
					})

			user_data['assigned_classes'] = assigned_classes

		return jsonify({'user': user_data}), 200

	# Update current user profile
	@bp.route('/profile', methods=['PUT'])
	@token_required
	def update_current_user_profile(current_user):
		data = request.get_json()

		# Update user fields
		if 'first_name' in data:
			current_user.first_name = data['first_name']
		if 'last_name' in data:
			current_user.name = data['last_name']
		if 'email' in data:
			# Check if email already exists
			existing_user = User.query.filter_by(email=data['email']).first()
			if existing_user and existing_user.id != current_user.id:
				return jsonify({'error': 'Email already in use'}), 409
			current_user.email = data['email']

		# Change password
		if 'current_password' in data and 'new_password' in data:
			if not check_password_hash(current_user.password, data['current_password']):
				return jsonify({'error': 'Current password is incorrect'}), 400

			if len(data['new_password']) < 8:
				return jsonify({'error': 'Password must be at least 8 characters'}), 400

			current_user.password = generate_password_hash(data['new_password'])

		# Save changes
		try:
			Base.session.commit()
			return jsonify({'success': True, 'message': 'Profile updated successfully'}), 200
		except Exception as e:
			Base.session.rollback()
			return jsonify({'error': f'Database error: {str(e)}'}), 500

	# Get single user
	@bp.route('/<int:user_id>', methods=['GET'])
	@token_required
	def get_user(current_user, user_id):
		# Users can only access their own info unless they're admin
		if current_user.id != user_id and current_user.role != Role.administrator:
			return jsonify({'error': 'Unauthorized access'}), 403

		user = User.query.get(user_id)
		if not user:
			return jsonify({'error': 'User not found'}), 404

		return jsonify({
			'id': user.id,
			'email': user.email,
			'first_name': user.first_name,
			'name': user.name,
			'role': user.role.name
		}), 200 

	# Create a new user (admin only)
	@bp.route('', methods=['POST'])
	@token_required
	@admin_required
	def create_user(current_user):
		data = request.get_json()

		# Validate required fields
		required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
		for field in required_fields:
			if field not in data:
				return jsonify({'error': f'Missing required field: {field}'}), 400

		# Check if email already exists
		existing_user = User.query.filter_by(email=data['email']).first()
		if existing_user:
			return jsonify({'error': 'Email already registered'}), 409

		# Set role
		role = None
		try:
			if data['role'] == 'student':
				role = Role.student
			elif data['role'] == 'teacher':
				role = Role.teacher
			elif data['role'] == 'administrator':
				role = Role.administrator
			else:
				return jsonify({'error': 'Invalid role'}), 400
		except ValueError:
			return jsonify({'error': 'Invalid role'}), 400

		# Create new user
		new_user = User(
			email=data['email'],
			password=generate_password_hash(data['password']),
			first_name=data['first_name'],
			name=data['last_name'],
			role=role
		)

		# Save to database
		try:
			Base.session.add(new_user)
			Base.session.commit()
			return jsonify({'success': True, 'message': 'User created successfully'}), 201
		except Exception as e:
			Base.session.rollback()
			return jsonify({'error': f'Database error: {str(e)}'}), 500

	# Delete user (admin only)
	@bp.route('/<int:user_id>', methods=['DELETE'])
	@token_required
	@admin_required
	def delete_user(current_user, user_id):
		user = User.query.get(user_id)
		if not user:
			return jsonify({'error': 'User not found'}), 404

		try:
			Base.session.delete(user)
			Base.session.commit()
			return jsonify({'success': True, 'message': 'User deleted successfully'}), 200
		except Exception as e:
			Base.session.rollback()
			return jsonify({'error': f'Database error: {str(e)}'}), 500
