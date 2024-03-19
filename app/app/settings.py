from datetime import timedelta
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(
    DEBUG=(bool, False)
)

environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY')

DEBUG = env.bool('DEBUG', False)

if DEBUG:
    ALLOWED_HOSTS = ['127.0.0.1', 'localhost',]
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOWED_ORIGINS = ('http://localhost:3000', )
    CORS_ALLOW_HEADERS = '*'
    CSRF_TRUSTED_ORIGINS = ["http://localhost:8000/",]
else:
    ALLOWED_HOSTS = ['127.0.0.1',]
#    SESSION_COOKIE_SECURE = True
#    CSRF_COOKIE_SECURE = True
#    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    CORS_ALLOW_ALL_ORIGINS = False
    # CORS_ALLOWED_ORIGINS = ('',)

CORS_URLS_REGEX = r'^/api/.*$'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'drf_spectacular',
    'admin_auto_filters',
    'django_cleanup',
    'django_filters',

    # apps
    'accounts',
    'booking',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'app.urls'

AUTH_USER_MODEL = 'accounts.User'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Istanbul'

USE_I18N = True

USE_TZ = True


LOGOUT_REDIRECT_URL = 'admin:login'
LOGIN_URL = 'admin:login'

LOCALE_PATHS = (BASE_DIR / 'locales',)


STATICFILES_DIRS = [
    BASE_DIR / 'assets',
]
STATIC_ROOT = BASE_DIR / 'static'
STATIC_URL = 'static/'

MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = 'media/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SPECTACULAR_SETTINGS = {
    'TITLE': 'BOOKING API',
    'DESCRIPTION': 'BOOKING Endpoints',
    'VERSION': '1.0.0',
    'DISABLE_ERRORS_AND_WARNINGS': True,
    'CONTACT': {
        'email': 'dicleacet@outlook.com'
    },
    'CAMELIZE_NAMES': False,
    "SWAGGER_UI_SETTINGS": {
            "deepLinking": True,
            "persistAuthorization": True,
            "displayOperationId": False,
            "docExpansion": 'none'
        },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=180),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=31),
    'SIGNING_KEY': env('SIGNING_KEY'),
    'VERIFYING_KEY': env('VERIFYING_KEY'),
    'UPDATE_LAST_LOGIN': True,
}

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.OrderingFilter',
        'rest_framework.filters.SearchFilter',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'app.helpers.StandardResultsSetPagination',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'PAGE_SIZE': 20
}
