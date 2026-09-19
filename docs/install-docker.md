# Развёртывание через Docker

## Требования к машине

- Linux или Windows
- ОЗУ ≥ 6 ГБ
- Диск ≥ 40 ГБ
- Интернет

Если интернет через прокси, в `docker-compose.yml` в сервисы `web-build` и `gate-build` после `environment:` добавить:

```yaml
http_proxy: http://HOST:PORT
https_proxy: http://HOST:PORT
```

## Запуск

1. Установить [Docker](https://docs.docker.com/get-docker/) и Docker Compose.
2. Клонировать репозиторий:

```
git clone https://github.com/essence-community/core
```

На Windows перед сборкой в `docker/docker-compose.yml` удалить строку:

```
- './gate/config:/opt/work_gate/configs'
```

Повторная сборка:

```
git clean -fdx
```

3. Подтянуть submodule:

```
git submodule init
git submodule update -f --remote
```

4. Собрать и запустить:

```
cd docker
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up
# или в фоне:
docker-compose -f docker-compose.yml up -d
```

## Обновление после изменений в репозитории

```
git submodule update -f --remote
docker-compose start liquibase
docker-compose ps
```

Контейнер `liquibase` должен завершиться с `exit 0`.
