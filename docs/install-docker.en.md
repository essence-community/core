# Deploy with Docker

[Русский](install-docker.md)

## Machine requirements

- Linux or Windows
- RAM ≥ 6 GB
- Disk ≥ 40 GB
- Internet

If the internet is behind a proxy, add this to `web-build` and `gate-build` in `docker-compose.yml` after `environment:`:

```yaml
http_proxy: http://HOST:PORT
https_proxy: http://HOST:PORT
```

## Run

1. Install [Docker](https://docs.docker.com/get-docker/) and Docker Compose.
2. Clone the repository:

```
git clone https://github.com/essence-community/core
```

On Windows, before the build, delete this line from `docker/docker-compose.yml`:

```
- './gate/config:/opt/work_gate/configs'
```

To rebuild from scratch:

```
git clean -fdx
```

3. Init submodules:

```
git submodule init
git submodule update -f --remote
```

4. Build and start:

```
cd docker
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up
# or in the background:
docker-compose -f docker-compose.yml up -d
```

## Update after repo changes

```
git submodule update -f --remote
docker-compose start liquibase
docker-compose ps
```

The `liquibase` container must exit with `exit 0`.
