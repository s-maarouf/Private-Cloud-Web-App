import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

Base = SQLAlchemy()

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL', 'mysql://smaarouf:S%40l%40HM%40%40r0uF@localhost/cloudstack')
SQLALCHEMY_TRACK_MODIFICATIONS = True
