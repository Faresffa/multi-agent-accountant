# Bill'z Backend API

Backend FastAPI avec authentification JWT et PostgreSQL local.

## 🚀 Installation

```bash
cd backend-api

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

## ⚙️ Configuration

**Toutes les variables sont obligatoires dans le fichier `.env`**

Créez un fichier `.env` à la racine de `backend-api/` :

```env
# Application
APP_NAME=Bill'z API
DEBUG=True
SECRET_KEY=votre-secret-key-unique

# Database PostgreSQL Local
DATABASE_URL=postgresql://postgres:password@localhost:5432/billz

# JWT Authentication
JWT_SECRET_KEY=votre-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### 🗄️ Configuration PostgreSQL :

1. Installez PostgreSQL : https://www.postgresql.org/download/
2. Créez la base de données :

```sql
CREATE DATABASE billz;
```

3. Mettez à jour `DATABASE_URL` dans le `.env` avec vos credentials

## 🗄️ Base de données

PostgreSQL local. Les tables sont créées automatiquement au démarrage de l'API.

## ▶️ Lancer l'API

```bash
# Depuis backend-api/
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

L'API sera accessible sur : `http://localhost:8000`

Documentation interactive : `http://localhost:8000/docs`

## 📡 Endpoints disponibles

### Authentification

- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Informations utilisateur (protégé)

### Health Check

- `GET /` - Informations API
- `GET /health` - Status de l'API

## 🧪 Tester l'API

```bash
# Créer un compte
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@billz.com","password":"test123","full_name":"Test User"}'

# Se connecter
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@billz.com","password":"test123"}'
```

## 📚 Structure

```
backend-api/
├── app/
│   ├── main.py              # Point d'entrée
│   ├── core/
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Connexion DB
│   │   └── security.py      # JWT & hashing
│   ├── models/
│   │   └── user.py          # Modèle User
│   ├── schemas/
│   │   └── user.py          # Schémas Pydantic
│   └── api/
│       └── auth.py          # Routes auth
├── requirements.txt
└── .env
```
