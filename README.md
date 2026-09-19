# CORE (Essence) 3.1.0

Мета-репозиторий платформы [Essence](https://github.com/essence-community/core): конструктор UI по метамодели, шлюз ungate и PostgreSQL.

- `frontend` — [core-frontend](https://github.com/essence-community/core-frontend) (`dev`), React + TypeScript
- `backend` — [core-backend](https://github.com/essence-community/core-backend) (`dev`), шлюз ungate, TypeScript

Лицензия: MIT. Образы: [essencecommunity](https://hub.docker.com/orgs/essencecommunity).

[English](README.en.md)

## Стек

Эталон — `docker/`. Так собрано сейчас:

| | Эталон (`docker/`) | engines / чарт |
| --- | --- | --- |
| Node.js | 24 | >= 22 (`package.json`) |
| Yarn | 1.x | >= 1.22 |
| PostgreSQL | 17-alpine | Helm/kube: `postgres:11-alpine` |
| nginx | `nginx:stable` | UI на `:9020` |
| Java | Temurin 17 | Liquibase / Gradle |
| Конфиг шлюза | YAML в `docker/gate/config/` | не TOML |

Стенд поднимает БД `core` и `core_auth`, шлюз с провайдером `authcore` (`coreauthpg`). Логин: `admin_core` / `admin_core`.

## Инициализация

```
git submodule update -f --init --remote
```

## Структура

1. `frontend` — веб-клиент конструктора (yarn workspaces)
2. `backend` — шлюз ungate, плагины, Liquibase (`dbms`, `dbms_auth`, …)
3. `docker` — эталонный стенд из исходников
4. `kube` — манифесты k8s и сборка образов (`kube/build.sh`)
5. `helm` — чарт `essence` 3.1.0
6. `docs` — гайды ([оглавление](docs/README.md), [English](docs/README.en.md))

## Локальный стенд

```
cd docker
docker compose up --build
```

- UI: http://localhost:9020
- PostgreSQL: `localhost:9021`, `s_su` / `s_su`, БД `core` и `core_auth`
- Конфиг шлюза: [docker/gate/config](docker/gate/config) (`t_providers.yaml`, `t_context.yaml`, …)

Готовые образы без локальной сборки: `kube/docker-compose.yml` (UI `:10020`, Postgres `:10021`).

## Kubernetes

```
helm install essence ./helm
# или
kubectl apply -f kube/k8s-essence.yaml
```

Сборка образов: `kube/build.sh`. Подробности: [helm/README.md](helm/README.md), [helm/INSTALL.md](helm/INSTALL.md).

## Разработка

- Frontend: [frontend/README.md](frontend/README.md) — `yarn start`, прокси `/api` и `/notification` на `localhost:9020`
- Backend: [backend/README.md](backend/README.md) — `yarn build`, схемы БД, переменные шлюза
- Ручная установка: [docs/install.md](docs/install.md)
