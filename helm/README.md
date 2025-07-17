# Essence Helm Chart

Этот Helm chart предназначен для развертывания приложения Essence в Kubernetes.

## Требования

-   Kubernetes 1.19+
-   Helm 3.0+
-   Доступ к Docker registry с образами essencecommunity/essence-backend и essencecommunity/essence-frontend

## Установка

### Базовая установка

```bash
helm install essence ./helm
```

### Установка с кастомными значениями

```bash
helm install essence ./helm -f values-custom.yaml
```

### Установка в определенный namespace

```bash
helm install essence ./helm --namespace my-namespace --create-namespace
```

## Обновление

```bash
helm upgrade essence ./helm
```

## Удаление

```bash
helm uninstall essence
```

## Конфигурация

### Основные параметры

| Параметр           | Описание               | Значение по умолчанию |
| ------------------ | ---------------------- | --------------------- |
| `namespace.create` | Создавать ли namespace | `true`                |
| `namespace.name`   | Имя namespace          | `essence`             |
| `database.enabled` | Включить базу данных   | `true`                |
| `backend.enabled`  | Включить backend       | `true`                |
| `frontend.enabled` | Включить frontend      | `true`                |
| `ingress.enabled`  | Включить ingress       | `true`                |

### Образы

| Параметр                    | Описание        | Значение по умолчанию |
| --------------------------- | --------------- | --------------------- |
| `global.imageRegistry`      | Docker registry | `essencecommunity`    |
| `backend.image.repository`  | Backend образ   | `essence-backend`     |
| `backend.image.tag`         | Backend тег     | `dev`                 |
| `frontend.image.repository` | Frontend образ  | `essence-frontend`    |
| `frontend.image.tag`        | Frontend тег    | `dev`                 |
| `database.image.repository` | Database образ  | `postgres`            |
| `database.image.tag`        | Database тег    | `11-alpine`           |

### Ресурсы

| Параметр                             | Описание                   | Значение по умолчанию |
| ------------------------------------ | -------------------------- | --------------------- |
| `backend.replicas`                   | Количество реплик backend  | `2`                   |
| `frontend.replicas`                  | Количество реплик frontend | `2`                   |
| `backend.resources.requests.memory`  | Backend memory request     | `512Mi`               |
| `backend.resources.requests.cpu`     | Backend CPU request        | `500m`                |
| `frontend.resources.requests.memory` | Frontend memory request    | `256Mi`               |
| `frontend.resources.requests.cpu`    | Frontend CPU request       | `250m`                |

### Хранилище

| Параметр                             | Описание                            | Значение по умолчанию |
| ------------------------------------ | ----------------------------------- | --------------------- |
| `backend.persistence.module.enabled` | Включить модульное хранилище        | `true`                |
| `backend.persistence.module.size`    | Размер модульного хранилища         | `5Gi`                 |
| `backend.persistence.config.enabled` | Включить конфигурационное хранилище | `true`                |
| `backend.persistence.config.size`    | Размер конфигурационного хранилища  | `200Mi`               |
| `database.persistence.enabled`       | Включить хранилище БД               | `true`                |
| `database.persistence.size`          | Размер хранилища БД                 | `5Gi`                 |

### Секреты

| Параметр                     | Описание            | Значение по умолчанию |
| ---------------------------- | ------------------- | --------------------- |
| `secrets.superAdminUser`     | Пользователь админа | `s_su`                |
| `secrets.superAdminPassword` | Пароль админа       | `s_su`                |
| `secrets.superAdminDb`       | База данных админа  | `s_su`                |

## Примеры конфигурации

### Продакшн конфигурация

```yaml
# values-production.yaml
global:
    imageRegistry: my-registry.com
    imagePullPolicy: Always

backend:
    replicas: 3
    image:
        tag: 'latest'
    resources:
        requests:
            memory: '1Gi'
            cpu: '1000m'
        limits:
            memory: '2Gi'
            cpu: '2000m'

frontend:
    replicas: 3
    image:
        tag: 'latest'
    resources:
        requests:
            memory: '512Mi'
            cpu: '500m'
        limits:
            memory: '1Gi'
            cpu: '1000m'

ingress:
    enabled: true
    annotations:
        kubernetes.io/ingress.class: nginx
        cert-manager.io/cluster-issuer: letsencrypt-prod
    hosts:
        - host: essence.mycompany.com
          paths:
              - path: /
                pathType: Prefix
    tls:
        - secretName: essence-tls
          hosts:
              - essence.mycompany.com
```

### Разработка конфигурация

```yaml
# values-development.yaml
backend:
  replicas: 1
  image:
    tag: "dev"

frontend:
  replicas: 1
  image:
    tag: "dev"

ingress:
  enabled: false

backend:
  service:
    type: LoadBalancer

frontend:
  service:
    type: LoadBalancer
```

## Troubleshooting

### Проверка статуса

```bash
kubectl get pods -n essence
kubectl get services -n essence
kubectl get ingress -n essence
```

### Логи

```bash
# Backend логи
kubectl logs -f deployment/essence-backend -n essence

# Frontend логи
kubectl logs -f deployment/essence-frontend -n essence

# Database логи
kubectl logs -f deployment/essence-backend-db -n essence
```

### Описание подов

```bash
kubectl describe pod <pod-name> -n essence
```

## Поддержка

Для получения поддержки обратитесь к документации проекта или создайте issue в репозитории.
