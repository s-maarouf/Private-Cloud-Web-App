from flask import Blueprint

from api.auth.login_routes import login_routes
from api.auth.register_routes import register_routes
from api.users.users_routes import users_routes
from api.users.profile_routes import profile_routes
from api.courses.subjects_routes import subjects_routes
from api.courses.labs_routes import labs_routes
from api.courses.class_routes import class_routes
from api.courses.progress_routes import progress_routes
from api.courses import courses_routes

# Authentication blueprints
register_bp = Blueprint('register', __name__, url_prefix='/api/register')
login_bp = Blueprint('login', __name__, url_prefix='/api/login')
register_routes(register_bp)
login_routes(login_bp)

# Users blueprints
users_bp = Blueprint('users', __name__, url_prefix='/api/users')
profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')
users_routes(users_bp)
profile_routes(profile_bp)

# Courses blueprints
courses_bp = Blueprint('courses', __name__, url_prefix='/api/courses')
subjects_bp = Blueprint('subjects', __name__, url_prefix='/api/subjects')
labs_bp = Blueprint('labs', __name__, url_prefix='/api/labs')
class_bp = Blueprint('classes', __name__, url_prefix='/api/classes')
progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')
courses_routes(courses_bp)
subjects_routes(subjects_bp)
labs_routes(labs_bp)
class_routes(class_bp)
progress_routes(progress_bp)
