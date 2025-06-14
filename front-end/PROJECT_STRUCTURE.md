# Structure du projet OpenStack Front-end

Ce document présente la nouvelle organisation du projet front-end pour améliorer la maintenabilité et faciliter la compréhension.

## Structure des dossiers

```md
src/
├── assets/                  # Pour les ressources statiques
│   ├── images/              # Images et illustrations
│   └── icons/               # Icônes spécifiques au projet
│
├── components/              # Composants réutilisables
│   ├── common/              # Composants génériques (boutons, inputs, etc.)
│   ├── layout/              # Composants de mise en page (header, footer, etc.)
│   └── ui/                  # Composants d'interface utilisateur spécifiques
│
├── pages/                   # Pages complètes correspondant aux routes
│   ├── admin/               # Pages d'administration
│   ├── auth/                # Pages d'authentification (login, register)
│   ├── public/              # Pages publiques (accueil, à propos, etc.)
│   ├── student/             # Pages pour les étudiants
│   └── teacher/             # Pages pour les enseignants
│
├── features/                # Organisation par fonctionnalités
│   ├── auth/                # Fonctionnalités d'authentification
│   ├── classes/             # Fonctionnalités liées aux classes
│   │   ├── components/      # Composants spécifiques aux classes
│   │   ├── hooks/           # Hooks personnalisés pour les classes
│   │   └── services/        # Services liés aux classes
│   ├── subjects/            # Fonctionnalités liées aux matières
│   └── labs/                # Fonctionnalités liées aux laboratoires
│
├── services/                # Services API et autres services
├── context/                 # Context API et autres états globaux
├── utils/                   # Fonctions utilitaires
└── styles/                  # Styles globaux et thèmes
```

## Conventions de nommage

- **Composants React**: PascalCase (ex: `Button.jsx`, `ClassForm.jsx`)
- **Fichiers utilitaires**: camelCase (ex: `apiService.js`, `formatDate.js`)
- **Dossiers**: camelCase (ex: `components`, `features`)
- **Types/Interfaces**: PascalCase (ex: `User.ts`, `ClassModel.ts`)

## Règles d'organisation

1. **Composants vs Features**:
   - **Composants**: éléments d'UI réutilisables qui ne contiennent pas de logique métier complexe
   - **Features**: organisation par domaine fonctionnel (authentification, classes, etc.)

2. **Styles**:
   - CSS module pour chaque composant, nommé `[ComponentName].module.css`
   - Variables CSS globales dans `/styles/variables.css`

3. **Tests**:
   - Placés à côté du fichier testé avec l'extension `.test.js` ou `.spec.js`

4. **Constantes**:
   - Fichiers dédiés dans `utils/constants.js`

## Routes et navigation

Les routes principales sont organisées comme suit:

- `/` - Page d'accueil publique
- `/login`, `/register` - Pages d'authentification
- `/admin/...` - Section administration
- `/student/...` - Section étudiants
- `/teacher/...` - Section enseignants

## Importations

Pour éviter les problèmes d'importation, nous utilisons des chemins relatifs à partir de la racine du projet:

```javascript
// Exemple d'importation
import Button from 'components/common/Button';
import { useAuth } from 'features/auth/hooks/useAuth';
```

## Bonnes pratiques

1. Chaque fichier ne doit contenir qu'un seul composant exporté par défaut
2. Séparer la logique et l'UI en utilisant des hooks personnalisés
3. Utiliser des props typées pour les composants
4. Documenter les composants et fonctions complexes
5. Éviter les dépendances circulaires
