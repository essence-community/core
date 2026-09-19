# CORE (Essence) 3.1.0

Meta-repo for the [Essence](https://github.com/essence-community/core) platform: a metamodel UI constructor, the ungate gateway, and PostgreSQL.

- `frontend` — [core-frontend](https://github.com/essence-community/core-frontend) (`dev`), React + TypeScript
- `backend` — [core-backend](https://github.com/essence-community/core-backend) (`dev`), ungate gateway, TypeScript

License: MIT. Images: [essencecommunity](https://hub.docker.com/orgs/essencecommunity).

[Русский](README.md)

## Stack

Reference setup is `docker/`. Current versions:

| | Reference (`docker/`) | engines / chart |
| --- | --- | --- |
| Node.js | 24 | >= 22 (`package.json`) |
| Yarn | 1.x | >= 1.22 |
| PostgreSQL | 17-alpine | Helm/kube: `postgres:11-alpine` |
| nginx | `nginx:stable` | UI on `:9020` |
| Java | Temurin 17 | Liquibase / Gradle |
| Gateway config | YAML in `docker/gate/config/` | not TOML |

The stand starts databases `core` and `core_auth`, gateway provider `authcore` (`coreauthpg`). Login: `admin_core` / `admin_core`.

## Init

```
git submodule update -f --init --remote
```

## Layout

1. `frontend` — constructor web client (yarn workspaces)
2. `backend` — ungate gateway, plugins, Liquibase (`dbms`, `dbms_auth`, …)
3. `docker` — reference stand from source
4. `kube` — k8s manifests and image build (`kube/build.sh`)
5. `helm` — `essence` chart 3.1.0
6. `docs` — guides ([index](docs/README.en.md); [Russian](docs/README.md))

## Local stand

```
cd docker
docker compose up --build
```

- UI: http://localhost:9020
- PostgreSQL: `localhost:9021`, `s_su` / `s_su`, databases `core` and `core_auth`
- Gateway config: [docker/gate/config](docker/gate/config) (`t_providers.yaml`, `t_context.yaml`, …)

Prebuilt images without a local build: `kube/docker-compose.yml` (UI `:10020`, Postgres `:10021`).

## Kubernetes

```
helm install essence ./helm
# or
kubectl apply -f kube/k8s-essence.yaml
```

Image build: `kube/build.sh`. Details: [helm/README.md](helm/README.md), [helm/INSTALL.md](helm/INSTALL.md).

## Development

- Frontend: [frontend/README.md](frontend/README.md) — `yarn start`, proxy `/api` and `/notification` to `localhost:9020`
- Backend: [backend/README.md](backend/README.md) — `yarn build`, DB schemas, gateway env
- Manual install: [docs/install.en.md](docs/install.en.md)
