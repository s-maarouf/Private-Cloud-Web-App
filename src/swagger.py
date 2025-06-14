from flask_swagger_ui import get_swaggerui_blueprint
from flask import jsonify

SWAGGER_URL = '/api/docs'  # URL pour exposer l'interface Swagger
API_URL = '/api/swagger.json'  # Notre URL d'API (peut être n'importe quelle URL valide)

# Fonction d'usine d'appel pour créer notre blueprint
swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "API de la Plateforme Éducative OpenStack"
    }
)

# Définir la spécification JSON Swagger
swagger_spec = {
    "swagger": "2.0",
    "info": {
        "title": "API de la Plateforme Éducative OpenStack",
        "description": "Documentation API pour la Plateforme Éducative OpenStack",
        "version": "1.0.0"
    },
    "basePath": "/api",
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "En-tête d'autorisation JWT utilisant le schéma Bearer. Exemple: \"Authorization: Bearer {token}\""
        }
    },
    "security": [
        {
            "Bearer": []
        }
    ],
    "paths": {
        # Points d'accès d'authentification
        "/auth/register": {
            "post": {
                "tags": ["Authentification"],
                "summary": "Inscrire un nouvel utilisateur",
                "description": "Crée un nouveau compte utilisateur",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "required": ["email", "password", "first_name", "last_name"],
                            "properties": {
                                "email": {"type": "string", "format": "email"},
                                "password": {"type": "string"},
                                "first_name": {"type": "string"},
                                "last_name": {"type": "string"},
                                "role": {"type": "string", "enum": ["student", "teacher"]}
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Inscription réussie"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    },
                    "409": {
                        "description": "Email déjà enregistré"
                    },
                    "500": {
                        "description": "Erreur serveur"
                    }
                }
            }
        },
        "/auth/login": {
            "post": {
                "tags": ["Authentification"],
                "summary": "Connecter un utilisateur",
                "description": "Authentifie un utilisateur et renvoie un jeton JWT",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "required": ["email", "password"],
                            "properties": {
                                "email": {"type": "string", "format": "email"},
                                "password": {"type": "string"}
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Connexion réussie"
                    },
                    "401": {
                        "description": "Identifiants invalides"
                    }
                }
            }
        },
        
        # Points d'accès des utilisateurs
        "/users": {
            "get": {
                "tags": ["Utilisateurs"],
                "summary": "Obtenir tous les utilisateurs",
                "description": "Renvoie une liste de tous les utilisateurs (admin seulement)",
                "responses": {
                    "200": {
                        "description": "Liste des utilisateurs"
                    },
                    "403": {
                        "description": "Accès non autorisé"
                    }
                }
            },
            "post": {
                "tags": ["Utilisateurs"],
                "summary": "Créer un nouvel utilisateur",
                "description": "Crée un nouvel utilisateur (admin seulement)",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "required": ["email", "password", "first_name", "last_name", "role"],
                            "properties": {
                                "email": {"type": "string", "format": "email"},
                                "password": {"type": "string"},
                                "first_name": {"type": "string"},
                                "last_name": {"type": "string"},
                                "role": {"type": "string", "enum": ["student", "teacher", "administrator"]}
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Utilisateur créé avec succès"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    },
                    "403": {
                        "description": "Accès non autorisé"
                    }
                }
            }
        },
          "/users/profile": {
            "get": {
                "tags": ["Utilisateurs"],
                "summary": "Obtenir le profil de l'utilisateur connecté",
                "description": "Renvoie les détails de l'utilisateur actuellement authentifié",
                "responses": {
                    "200": {
                        "description": "Informations de l'utilisateur connecté"
                    },
                    "401": {
                        "description": "Non authentifié"
                    }
                }
            },
            "put": {
                "tags": ["Utilisateurs"],
                "summary": "Mettre à jour le profil de l'utilisateur connecté",
                "description": "Met à jour les informations de l'utilisateur actuellement authentifié",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {"type": "string", "format": "email"},
                                "first_name": {"type": "string"},
                                "last_name": {"type": "string"},
                                "current_password": {"type": "string"},
                                "new_password": {"type": "string"}
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Profil mis à jour avec succès"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    },
                    "401": {
                        "description": "Non authentifié"
                    },
                    "409": {
                        "description": "Email déjà utilisé"
                    }
                }
            }
        },
        
        "/users/{user_id}": {
            "get": {
                "tags": ["Utilisateurs"],
                "summary": "Obtenir des informations sur l'utilisateur",
                "description": "Renvoie des détails pour un utilisateur spécifique (soi-même ou admin)",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "type": "integer",
                        "description": "ID de l'utilisateur"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Informations sur l'utilisateur"
                    },
                    "403": {
                        "description": "Accès non autorisé"
                    },
                    "404": {
                        "description": "Utilisateur non trouvé"
                    }
                }
            }
        },
        
        # Points d'accès de profil
        "/profile": {
            "get": {
                "tags": ["Profil"],
                "summary": "Obtenir le profil de l'utilisateur actuel",
                "description": "Renvoie les informations de profil pour l'utilisateur authentifié",
                "responses": {
                    "200": {
                        "description": "Informations de profil utilisateur"
                    }
                }
            },
            "put": {
                "tags": ["Profil"],
                "summary": "Mettre à jour le profil de l'utilisateur actuel",
                "description": "Met à jour le profil de l'utilisateur authentifié",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "first_name": {"type": "string"},
                                "last_name": {"type": "string"},
                                "current_password": {"type": "string"},
                                "new_password": {"type": "string"}
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Profil mis à jour avec succès"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    }
                }
            }
        },
        
        # Points d'accès des matières
        "/subjects": {
            "get": {
                "tags": ["Matières"],
                "summary": "Obtenir toutes les matières",
                "description": "Renvoie une liste de toutes les matières",
                "responses": {
                    "200": {
                        "description": "Liste des matières"
                    }
                }
            },
            "post": {
                "tags": ["Matières"],
                "summary": "Créer une matière",
                "description": "Crée une nouvelle matière (enseignant ou admin seulement)",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "required": ["name"],
                            "properties": {
                                "name": {"type": "string"}
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Matière créée avec succès"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    },
                    "409": {
                        "description": "Une matière avec ce nom existe déjà"
                    }
                }
            }
        },
        
        "/subjects/{subject_id}": {
            "get": {
                "tags": ["Matières"],
                "summary": "Obtenir des informations sur la matière",
                "description": "Renvoie des détails pour une matière spécifique",
                "parameters": [
                    {
                        "name": "subject_id",
                        "in": "path",
                        "required": True,
                        "type": "integer",
                        "description": "ID de la matière"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Informations sur la matière"
                    },
                    "404": {
                        "description": "Matière non trouvée"
                    }
                }
            },
            "put": {
                "tags": ["Matières"],
                "summary": "Mettre à jour les informations de la matière",
                "description": "Met à jour les informations d'une matière (admin seulement)",
                "parameters": [
                    {
                        "name": "subject_id",
                        "in": "path",
                        "required": True,
                        "type": "integer",
                        "description": "ID de la matière"
                    },
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "required": ["name"],
                            "properties": {
                                "name": {"type": "string"}
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Matière mise à jour avec succès"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    },
                    "404": {
                        "description": "Matière non trouvée"
                    },
                    "409": {
                        "description": "Une matière avec ce nom existe déjà"
                    }
                }
            },
            "delete": {
                "tags": ["Matières"],
                "summary": "Supprimer une matière",
                "description": "Supprime une matière (admin seulement)",
                "parameters": [
                    {
                        "name": "subject_id",
                        "in": "path",
                        "required": True,
                        "type": "integer",
                        "description": "ID de la matière"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Matière supprimée avec succès"
                    },
                    "404": {
                        "description": "Matière non trouvée"
                    }
                }
            }
        },
        
        # Points d'accès des classes
        "/class": {
            "get": {
                "tags": ["Classes"],
                "summary": "Obtenir toutes les classes",
                "description": "Renvoie une liste de toutes les classes",
                "responses": {
                    "200": {
                        "description": "Liste des classes"
                    }
                }
            }
        },
        
        "/class/{class_id}": {
            "get": {
                "tags": ["Classes"],
                "summary": "Obtenir des informations sur la classe",
                "description": "Renvoie des détails pour une classe spécifique, y compris les étudiants et les matières",
                "parameters": [
                    {
                        "name": "class_id",
                        "in": "path",
                        "required": True,
                        "type": "integer",
                        "description": "ID de la classe"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Informations sur la classe"
                    },
                    "404": {
                        "description": "Classe non trouvée"
                    }
                }
            }
        },
        
        # Points d'accès des laboratoires
        "/labs": {
            "get": {
                "tags": ["Laboratoires"],
                "summary": "Obtenir tous les laboratoires",
                "description": "Renvoie une liste de tous les laboratoires, peut filtrer par subject_id",
                "parameters": [
                    {
                        "name": "subject_id",
                        "in": "query",
                        "required": False,
                        "type": "integer",
                        "description": "Filtrer les laboratoires par ID de matière"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Liste des laboratoires"
                    }
                }
            },
            "post": {
                "tags": ["Laboratoires"],
                "summary": "Créer un laboratoire",
                "description": "Crée un nouveau laboratoire (enseignant seulement)",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": True,
                        "schema": {
                            "type": "object",
                            "required": ["name", "subject_id"],
                            "properties": {
                                "name": {"type": "string"},
                                "subject_id": {"type": "integer"},
                                "description": {"type": "string"},
                                "instructions": {"type": "string"}
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Laboratoire créé avec succès"
                    },
                    "400": {
                        "description": "Entrée invalide"
                    },
                    "404": {
                        "description": "Matière non trouvée"
                    }
                }
            }
        },
        
        "/labs/{lab_id}": {
            "get": {
                "tags": ["Laboratoires"],
                "summary": "Obtenir des informations sur le laboratoire",
                "description": "Renvoie des détails pour un laboratoire spécifique",
                "parameters": [
                    {
                        "name": "lab_id",
                        "in": "path",
                        "required": True,
                        "type": "integer",
                        "description": "ID du laboratoire"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Informations sur le laboratoire"
                    },
                    "404": {
                        "description": "Laboratoire non trouvé"
                    }
                }
            }
        }
    }
}

def get_swagger_json():
    return jsonify(swagger_spec)
