import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

Base = SQLAlchemy()

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL', 'mysql://root:Mugiwara311428@localhost/cloudstack')
SQLALCHEMY_TRACK_MODIFICATIONS = True
