# LLM Gateway (Nginx)

Gateway HTTP basado en Nginx para enrutar solicitudes hacia modelos LLM locales y proteger el acceso mediante validación de token. Incluye páginas estáticas de login/logout para uso web.

## Estructura

- docker-compose.yml: orquesta Nginx.
- nginx.conf: configuración principal del gateway.
- static/: UI estática (login/logout).

## Requisitos

- Docker + Docker Compose.
- Servicios locales disponibles:
  - Auth Service en http://localhost:9000
  - LLM/Chat Service en http://localhost:9090

## Levantar el gateway

```bash
docker compose up -d
```

El gateway quedará disponible en http://localhost:8080

## Flujo de autenticación

- El token se extrae desde:
  - Header `Authorization` (SDK / API)
  - Cookie `auth_token` (web)
- La validación se realiza por `/_auth` (internal) contra http://host.docker.internal:9000/validate

## Endpoints expuestos

### UI

- /login → página de login
- /logout → página de logout
- / → UI principal protegida (proxy a http://host.docker.internal:9090/)

### Auth

- /auth/login → proxy a http://host.docker.internal:9000/login
- /llm/login → proxy a http://host.docker.internal:9000/llm/login

### API LLM

- /v1/chat/completions → proxy a http://host.docker.internal:9090/v1/chat/completions (usa cookie)
- /chat/completions → proxy a http://host.docker.internal:9090/v1/chat/completions (usa Authorization)
- /completion → proxy a http://host.docker.internal:9090/v1/completion (usa Authorization)
- /llm/completion → proxy a http://host.docker.internal:9090/completion (usa Authorization)
- /llm/chat/completions → proxy a http://host.docker.internal:9090/chat/completions (usa Authorization)

## Notas

- `host.docker.internal` permite que el contenedor acceda a servicios locales en macOS.
- Las respuestas 401 de APIs retornan JSON: `{ "error": "Unauthorized" }`.
- Si el request proviene de SDK (User-Agent `Architecture-PE/LLM-Client` o `OpenAI/Python`) y no existe ruta, se retorna 404 JSON.

