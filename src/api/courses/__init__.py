from .subjects_routes import subjects_routes
from .labs_routes import labs_routes
from .class_routes import class_routes
from .progress_routes import progress_routes

# Define courses_routes function to be imported
def courses_routes(bp):
    @bp.route('', methods=['GET'])
    def get_courses():
        # This could be implemented to aggregate data from labs, subjects, etc.
        return {"message": "Courses endpoint"}