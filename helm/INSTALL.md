# Установка и использование Essence Helm Chart

## Предварительные требования

### 1. Установка Helm

#### Ubuntu/Debian:

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

#### CentOS/RHEL:

```bash
sudo yum install helm
```

#### macOS:

```bash
brew install helm
```

#### Windows:

```bash
choco install kubernetes-helm
```

### 2. Установка kubectl

#### Ubuntu/Debian:

```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
```

#### CentOS/RHEL:

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
```

#### macOS:

```bash
brew install kubectl
```

### 3. Настройка доступа к Kubernetes кластеру

Убедитесь, что у вас есть доступ к Kubernetes кластеру:

```bash
kubectl cluster-info
```

## Быстрая установка

### Использование скрипта развертывания

1. Перейдите в директорию helm:

```bash
cd helm
```

2. Запустите скрипт развертывания:

```bash
# Установка с настройками по умолчанию
./deploy.sh

# Установка с настройками для разработки
./deploy.sh -f values-development.yaml

# Установка с настройками для продакшена
./deploy.sh -f values-production.yaml

# Dry run (проверка без установки)
./deploy.sh -f values-production.yaml -d
```

### Ручная установка

1. Установка с настройками по умолчанию:

```bash
helm install essence . --namespace essence --create-namespace
```

2. Установка с кастомными значениями:

```bash
helm install essence . -f values-production.yaml --namespace essence --create-namespace
```

3. Установка с переопределением параметров:

```bash
helm install essence . \
  --set backend.replicas=3 \
  --set frontend.replicas=3 \
  --set global.imageRegistry=my-registry.com \
  --namespace essence --create-namespace
```

## Проверка установки

### Проверка статуса подов:

```bash
kubectl get pods -n essence
```

### Проверка сервисов:

```bash
kubectl get services -n essence
```

### Проверка ingress:

```bash
kubectl get ingress -n essence
```

### Проверка persistent volumes:

```bash
kubectl get pv -n essence
kubectl get pvc -n essence
```

## Доступ к приложению

### Через LoadBalancer (если настроен):

```bash
kubectl get service essence-frontend -n essence
```

### Через port-forward:

```bash
kubectl port-forward service/essence-frontend 8080:8080 -n essence
```

### Через ingress (если настроен):

```bash
kubectl get ingress essence-frontend-ingress -n essence
```

## Обновление

### Обновление с новыми значениями:

```bash
helm upgrade essence . -f values-production.yaml --namespace essence
```

### Обновление с переопределением параметров:

```bash
helm upgrade essence . \
  --set backend.image.tag=latest \
  --set frontend.image.tag=latest \
  --namespace essence
```

## Удаление

### Полное удаление:

```bash
helm uninstall essence -n essence
kubectl delete namespace essence
```

### Удаление с сохранением данных:

```bash
helm uninstall essence -n essence
# Persistent volumes останутся и могут быть переиспользованы
```

## Troubleshooting

### Просмотр логов:

```bash
# Backend логи
kubectl logs -f deployment/essence-backend -n essence

# Frontend логи
kubectl logs -f deployment/essence-frontend -n essence

# Database логи
kubectl logs -f deployment/essence-backend-db -n essence
```

### Описание ресурсов:

```bash
kubectl describe pod <pod-name> -n essence
kubectl describe service essence-backend -n essence
kubectl describe ingress essence-frontend-ingress -n essence
```

### Проверка событий:

```bash
kubectl get events -n essence --sort-by='.lastTimestamp'
```

### Проверка конфигурации:

```bash
# Проверка шаблонов без установки
helm template essence . --dry-run

# Проверка с кастомными значениями
helm template essence . -f values-production.yaml --dry-run
```

## Настройка хранилища

### Создание директорий для hostPath:

```bash
sudo mkdir -p /mnt/module_essence
sudo mkdir -p /mnt/config_essence
sudo mkdir -p /mnt/pg_data
sudo chmod 755 /mnt/module_essence /mnt/config_essence /mnt/pg_data
```

### Настройка StorageClass (опционально):

```bash
# Создание StorageClass для local storage
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: module-essence
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: config-essence
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: pg-data
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
EOF
```

## Безопасность

### Изменение секретов:

```bash
# Создание секретов с реальными значениями
kubectl create secret generic essence-secret \
  --from-literal=super_admin_user=admin \
  --from-literal=super_admin_password=secure-password \
  --from-literal=super_admin_db=essence_prod \
  -n essence
```

### Настройка RBAC:

```bash
# Проверка RBAC настроек
kubectl get serviceaccount -n essence
kubectl get clusterrole -n essence
kubectl get rolebinding -n essence
```

## Мониторинг

### Установка Prometheus и Grafana (опционально):

```bash
# Добавление репозитория Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Установка Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### Настройка алертов:

```bash
# Создание ConfigMap с алертами
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: essence-alerts
  namespace: essence
data:
  alerts.yaml: |
    groups:
    - name: essence
      rules:
      - alert: EssenceBackendDown
        expr: up{job="essence-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Essence backend is down"
EOF
```
