# Система модулей

![Система модулей](images/p128-01.jpg)

Зачем нужны модули
Как добавить свой модуль
Дополнительные возможности
Что такое метамодель
Что такое глобальные переменные
Какие типы данных доступны
Параметры который приходят в модуль
Как использовать другие модули в своих модулях
Загрузка модуля (zip)


Зачем нужны модули
Модульная система предназначена для расширения существующего набора компонентов посредством добавления новых
пакетов (модулей) через систему администрирования либо изменения существующих классов.


Как добавить свой модуль
Для добавления модуля необходимо:

1. Реализовать модуль как отдельный пакет;
2. Использовать setComponent для установки компонента как модуля;
3. … в стадии разработки.


Дополнительные возможности
Ядро конструктора использует react с динамическим обновлениям данных и возможностью изменения темы

1. React - служит для отображения данных и манипуляции с DOM элементами. Пакет должен отдавать react компонент в качестве модуля; 2.

2. Mobx - утилита для управления состоянием приложения в реальном времени. С помощью этой утилиты можно реагировать на изменения окружающих модулей и распространять данных из своего модуля;
3. StoreBaseModel - базовая модель для создания хранилища по обмену данными между серверов и клиентом. Так же служить для реализация связей по средствам мастеров. Добавляет автоматическое обновление данных при изменении мастера.
4. Material-ui - утилита для визуализации простых компонентов и работы с css. На базе утилиты построена система изменения темы и цветовой палитры приложения.
5. PageModel (PageStore) - хранилище состояние страницы, на которой находится модуль. Предоставляет доступ к другим модулях через хранилища (store) других модулей. Дополнительно хранит в себе открытые окна и состоянием видимости страницы.
6. ApplicationModel (ApplicationStore) - общее хранилище приложения. Служит для работы с модулем авторизации и уведомлением. Хранит информацию о всех активных страницах в приложении. Позволяет осуществлять переход между страницами с предоставляем информации о предыдущей странице с помощью глобальных переменных.


Что такое метамодель
Метамодель приложения разделена на 4 базовых типа:

1. Атрибуты - описывают типы данных в настройках одного класса. Каждый атрибут может быть опциональным. При работе с атрибутом в модуле необходимо проверить наличие в нем данных, чтобы не вызвать критическую ошибку.
2. Классы - описывают состояние модуля. Класс может включать в себя все атрибуты или часть из них. Обязательным атрибутом является только type по которому происходит определение, к какому модулю относится данный класс.
3. Объекты - служат для объединения классов в один объект (например: таблица может включать в себя колонки для построения таблицы с нужными колонками для отображения). Вложенность одних объектов в другие определяется на уровне создания класса. Для каждого класса разрешается переопределить его атрибуты.
4. Страница - служит для построения страницы (PageStore) из объектов. Для каждого класса разрешается переопределить его атрибуты, при этом переопределение будет доступно только для выбранной страницы. Один и тот же объект может быть добавлен на несколько страниц сразу.


Что такое глобальные переменные
Для общения между модулями реализовано общее хранилище переменных (globalValues в PageStore).

Хранилище позволяет:

1. Записывать данные из любого модуля (при использовании одного и того же ключа в разных модулях согласованность данных не гарантирована, вся ответственность ложится на создателя метамодели).
2. Читать данные - при этом нужно понимать, что тип данных может быть любой: undefined, null, object, string, number, boolean, "array". При чтении данных нужно использовать reaction или autorun из mobx либо использовать mobx-react для подписывания render функции самого компонента на изменение данных.
3. Другие действия с данными - происходит посредством вызовов методов ObservableMap.

Глобальные переменные так же могут изменится при переходе между страницами посредством applicationStore


Какие типы данных доступны
Для работы со статической типизацией и утилитами предоставляется пакет constructor-share который включает:

1. Типы данных для атрибутов BuilderConfigType. Данная структура синхронизируется с базой данных и позволяет поддерживать код в актуальном состоянии.
2. ApplicationModelType - тип данных для работы с приложением и авторизации. Доступно через pageStore модуля.
3. PageModelType - хранит состояние страницы.


Параметры который приходят в модуль
1. bc - BuilderConfigType хранит состоянии класса переданного из метамодели;
2. pageStore - состояние страница, описано в типе PageModelType
3. hidden - (boolean) - состояние скрытия контента с помощью правил метамодели
4. disabled - (boolean) - состояние блокировки с помощью правил метамодели
5. readOnly - (boolean) - состояние "только для чтения" с помощью правил метамодели

6. visible - (boolean) - состояние отображения контента на странице. Если страница полностью не показывается, то visible будет false. Иначе передается по цепочке.

Параметры hidden, disabled, readOnly, visible могут быть изменены в зависимости от состояний промежуточных компонентов.


Как использовать другие модули в своих модулях
Для отображения дочерних компонентов использовать mapComponents при этом в каждый компонент необходимо обязательно
передать pageStore и bc для правильной работы другого модуля. Так же нужно прокинуть по цепочке disabled, hidden, readOnly,
visible при этом значения можно менять в зависимости от необходимости либо оставить какие пришли для совместимости.


Загрузка модуля (zip)
Для разворачивания модуля на стенде необходимо:

1. собрать с помощью команды yarn build
2. создать архив для передачи yarn zip

После создания архив будет доступен в папке dist.

Имя zip файла создается по шаблону ${имя-модуля}-${версия-модуля}.zip

Модуль содержит:

1. исходные файлы самого модуля, которые располагаются в dist
2. файл манифеста, который хранится по пути проекта src/schema_manifest.json


## Модуль УСПО




![Модуль УСПО](images/p130-01.jpg)

![Модуль УСПО](images/p137-01.jpg)

![Модуль УСПО](images/p137-02.jpg)

![Модуль УСПО](images/p138-01.jpg)

1. Введение 1.1 Цель 1.2 Определения и сокращения
2. Требования к квалификации системного администратора
3. Назначение и условия применения 3.1 Назначение 3.2 Условия применения
4. Описание операций 4.1 Установка s3 хранилища 4.1.1 Установка 4.2 Развёртывание базы данных 4.2.1 Развёртывание базы данных 4.3 Установка Wildfly 4.3.1 Установка Wildfly 4.3.2 Подключение модуля Postgres JDBC 4.3.3 Подключение датасорса 4.4 Развёртывание УСПО 4.4.1 Установка web и receiver 4.4.2 Установка service 4.4.3 Подключение к CORE


1. Введение

1.1 Цель
Данный документ содержит последовательность действий по разворачиванию «Универсальной системы печати отчетности».


1.2 Определения и сокращения

Термин Описание

УСПО Универсальная система печати отчетности

ПО Программное обеспечение

ИР Информационные ресурсы

АПК Аппаратно-программный комплекс


2. Требования к квалификации системного администратора
Для обслуживания Системы администратор должен обладать следующими навыками:

Навыки работы в серверных Linux либо опыт администрирования *nix подобных систем;
Опыт администрирования БД PostgreSql 10+;

Для поддержки Системы системному администратору необходимо:

Ознакомиться с документацией производителей используемого аппаратного и системного программного
обеспечения;


3. Назначение и условия применения

3.1 Назначение
«Универсальная система печати отчетности» представляет собой комплексное решение, для формирования отчетов


3.2 Условия применения
Для работы Системы на сервере предварительно следует установить:

Сервер ПО

Сервер БД УСПО СУБД PostgreSQL 10+

ОС CentOs 7+

Сервер хранения отчетов ОС CentOs 7+

Сервер приложений ОС CentOs 7+

OpenJDK 11+


4. Описание операций

4.1 Установка s3 хранилища
riak cs — свободная реализация s3 хранилища

riak kv — свободная nosql БД


4.1.1 Установка

1. Добавляем репозиторий riak /etc/yum.repos.d/basho.repo


[basho_riak]
name=basho_riak
baseurl=https://packagecloud.io/basho/riak/el/7/$basearch

repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/basho/riak/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[basho_riak-cs]
name=basho_riak-cs
baseurl=https://packagecloud.io/basho/riak-cs/el/7/$basearch
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/basho/riak-cs/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[basho_stanchion]
name=basho_stanchion
baseurl=https://packagecloud.io/basho/stanchion/el/7/$basearch
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/basho/stanchion/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300


2. Установка Riak KV

Вызвать установку
yum install riak

3. Установка Riak CS

Вызвать установку
yum install riak-cs

4. Установка Stanchion

Вызвать установку
yum install stanchion

5. Настраиваем /etc/riak/advanced.config


[{lager,
[
{extra_sinks,
[
{object_lager_event,
[{handlers,
[{lager_file_backend,
[{file, "/var/log/riak/object.log"},
{level, info},

{formatter_config, [date, " ", time," [",
severity,"] ",message, "\n"]}
]
}]
},
{async_threshold, 500},
{async_threshold_window, 50}]
}
]
}
]
},
{eleveldb, [
{total_leveldb_mem_percent, 30}
]},
{riak_kv, [
%% Other configs
{add_paths, ["/usr/lib64/riak-cs/lib/riak_cs-2.1.1/ebin"]},
%% -- riak cs
{storage_backend, riak_cs_kv_multi_backend},
{multi_backend_prefix_list, [{<<"0b:">>, be_blocks}]},
{multi_backend_default, be_default},
{multi_backend, [
{be_default, riak_kv_eleveldb_backend, [
{data_root, "/var/lib/riak/leveldb"}
]},
{be_blocks, riak_kv_bitcask_backend, [
{data_root, "/var/lib/riak/bitcask"}
]}
]}
%% Other configs
]},
{riak_core, [
%% Other configs
{default_bucket_props, [{allow_mult, true}]}
%% Other configs
]}].


6. Включаем авто запуск Riak KV

Показать команду

```
systemctl enable riak
```

7. Стартуем Riak KV

Показать команду

```
systemctl start riak
```

8. Включаем авто запуск Stanchion

Показать команду

```
systemctl enable stanchion
```

9. Стартуем Stanchion

Показать команду

```
systemctl start stanchion
```

10. Настраиваем Riak CS /etc/riak-cs/riak-cs.conf


listener = 0.0.0.0:10011
anonymous_user_creation = on
admin.listener = 127.0.0.1:1101


11. Включаем авто запуск Riak CS

Показать команду

```
systemctl enable riak-cs
```

12. Стартуем Riak CS

Показать команду

```
systemctl start riak-cs
```

13. Создаем пользователей и сохраняем доступы


Admin
curl -H 'Content-Type: application/json' -XPOST http://127.0.0.1:
11011/riak-cs/user --data '{"email":"admin@example.com", "name":"
admin"}'
{"email":"admin@example.com","display_name":"admin","name":"
admin","key_id":"LQPKAD2AUQIMU_RWF9KH","key_secret":"
RLBTEONm_zr8nrAmQSge-kEt5P5qsKM9boYLPw==","id":"
be2aeacc3c4532d7c245e3d4192c5705321d4620ef903b275b95d0a1d1662d27","
status":"enabled"}
Report
curl -H 'Content-Type: application/json' -XPOST http://127.0.0.1:
11011/riak-cs/user --data '{"email":"report@example.com", "name":"
report"}'
{"email":"report@example.com","display_name":"report","name":"
report","key_id":"V7CBOR8N--CYOCX_FQ0U","key_secret":"
RIEzm3o3myteoLNW_10aH5NVq_mXQOwF19hWuQ==","id":"
604ae623a335f8cfa92972d15f09f746f9a585ddbc82d325a8b3f714e6138080","
status":"enabled"}


14. Перенастраиваем /etc/riak-cs/riak-cs.conf


anonymous_user_creation = off
#admin.listener = 127.0.0.1:1101admin.key = LQPKAD2AUQIMU_RWF9KH
admin.secret = RLBTEONm_zr8nrAmQSge-kEt5P5qsKM9boYLPw==


15. Перенастраиваем /etc/stanchion/stanchion.conf


admin.key = LQPKAD2AUQIMU_RWF9KH
admin.secret = RLBTEONm_zr8nrAmQSge-kEt5P5qsKM9boYLPw==


16. Перезапускаем Stanchion

Показать команду

```
systemctl restart stanchion
```

17. Перезапускаем Riak CS

Показать команду

```
systemctl restart riak-cs
```

4.2 Развёртывание базы данных

4.2.1 Развёртывание базы данных

Для развёртывания базы данных Системы на сервере БД УСПО необходимо установить СУБД PostgreSQL.

1. Создать пользователей:

Суперпользователь, от которого идет заливка бд:


```
CREATE ROLE s_su WITH
  LOGIN
  SUPERUSER
  INHERIT
  CREATEDB
  CREATEROLE
  NOREPLICATION;
```

Пользователь для входа шлюза:


```
CREATE ROLE s_uc WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

ALTER ROLE s_uc SET search_path TO uspo, public, pg_catalog;
```

Пользователь без возможности авторизации, которому будут принадлежать функции и процедуры:


```
CREATE ROLE s_up WITH
  NOLOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;
```

Пользователь для входа java:


```
CREATE ROLE uspo WITH
  LOGIN
  NOSUPERUSER

    INHERIT
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

 ALTER ROLE uspo SET search_path TO uspo, public, pg_catalog;
```

2. Создать контейнер БД:


```
CREATE DATABASE uspo
  WITH
  OWNER = s_su
  TEMPLATE = template0
  ENCODING = 'UTF8'
  LC_COLLATE = 'ru_RU.UTF-8'
  LC_CTYPE = 'ru_RU.UTF-8'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;
```

3. Распаковать архив и настроить liquibase.uspo.properties


```
driver: org.postgresql.Driver
url: jdbc:postgresql://127.0.0.1:5432/uspo
username: s_su
password: s_su
```

4. Настроить liquibase.meta.properties — должна смотреть на БД core.

5. Запустить update.


4.3 Установка Wildfly

4.3.1 Установка Wildfly

Установка производится согласно инструкции https://docs.wildfly.org/17/Getting_Started_Guide.html


4.3.2 Подключение модуля Postgres JDBC

Скачиваем https://jdbc.postgresql.org/download.html и распаковываем, например, /opt/pjdbc

Подключаем к wildfly


#cd /opt/wildfly-17.0.0.Final/#./bin/jboss-cli.sh
module add --name=org.postgresql --slot=main --resources=/opt/pjdbc
/postgresql-jdbc.jar —dependencies=javax.api,javax.transaction.api
connect
/subsystem=datasources/jdbc-driver=postgres:add(driver-name="postgres",
driver-module-name="org.postgresql",driver-class-name=org.postgresql.
Driver)

4.3.3 Подключение датасорса

1. Заходим в администрирование wildfly


2. Создаем датасорс uspo, JNDI: java:jboss/datasources/print_server


4.4 Развёртывание УСПО

УСПО состоит из:

web – приложение которое формирует отчет (war приложение)
receiver – приложение прием запросов добавление в очередь (war приложение)
service – приложение обработки очереди (jar приложение)


4.4.1 Установка web и receiver

Заходим в администрирование


4.4.2 Установка service

1. Распаковываем, например: /opt/uspo/service Настраиваем /opt/uspo/service/uspo_print_service.properties


db.url=jdbc:postgresql://127.0.0.1:5432/uspo
db.user=uspo
db.pass=uspo
uspo.web.endpoint=http://127.0.0.1:8000/uspo-print-web
/print -- web


2. Настраиваем /opt/uspo/service/daemon.sh


```
    #!/bin/sh
    export PATH=$JAVA_HOME/bin:$PATH
    DIRNAMESTART=`dirname "$0"`
    PROGNAMESTART=`basename "$0"`
    DIR="$(dirname $(readlink -f $0))"

cd $DIR
pid=`pgrep -f "java.*-jar $DIR"`
start() {
if [ ! -z $pid ]; then
        echo "USPO Service is already running pid $pid"
        exit 1
fi
nohup java -Dlog4j.configuration=file:$DIR/log4j.properties -jar
$DIR/uspo-print-service.jar $DIR/uspo_print_service.properties
2>&1 </dev/null | cat >> $DIR/logs/service.log &
}

stop() {
if [ ! -z $pid ] ; then
kill $pid
else
   echo "USPO Service do not running"
   exit 1
fi
}

case "$1" in
     start)
         start
         ;;
     stop)
         stop
         ;;
     restart)
         stop
         start
         ;;
     *)
         echo "Usage: $PROGNAMESTART start|stop|restart"
         exit 1
esac

exit 0
```

3. Настраиваем запуск

Показать команду

```
chmod +x /opt/uspo/service/daemon.sh
```

4. Настраиваем сервис /etc/systemd/system/uspo-service.service


```
[Unit]
Description=USPO Service
Documentation=USPO Service
After=network.target

[Service]
Type=forking

#User=uspo-wildfly
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity

ExecStart=/opt/uspo/service/daemon.sh start
ExecReload=/opt/uspo/service/daemon.sh restart
ExecStop=/opt/uspo/service/daemon.sh stop

[Install]
WantedBy=multi-user.target
```

5. Включаем в авто старт

Показать команду

```
systemctl enable uspo-service
```

6. Подключаемся к бд uspo, правим настройки


--

```
UPDATE uspo.t_d_global
SET cv_value='127.0.0.1:10011'
WHERE ck_id='cv_riak_url';
--   riak cs
UPDATE uspo.t_d_global
SET cv_value='reports'
WHERE ck_id='cv_riak_bucket';--id key report
UPDATE uspo.t_d_global
SET cv_value='V7CBOR8N--CYOCX_FQ0U'
WHERE ck_id='cv_riak_access_key';
--secret report
UPDATE uspo.t_d_global
SET cv_value='RIEzm3o3myteoLNW_10aH5NVq_mXQOwF19hWuQ=='
WHERE ck_id='cv_riak_secret_access_key';
-- web
UPDATE uspo.t_d_global
SET cv_value='http://127.0.0.1:7080/uspo-print-web/print'
WHERE ck_id='print_servlet_url';
--   core
UPDATE uspo.t_d_global
SET cv_value='http://127.0.0.1:8080/api?
action=dml&query=MTAddNotification&plugin=PrintJasperServer'
WHERE ck_id='external_rest_url';
-- ,
UPDATE uspo.t_d_global
SET cv_value='/opt/vdir'
WHERE ck_id='jr_virtualizer_directory_name';
```

7. Стартуем сервис

Показать команду

```
systemctl restart uspo-service
```

8.

8. Перезапускаем приложения в wildfly


4.4.3 Подключение к CORE

1. Добавляем провайдер ../t_providers.toml


```
[[data]]
ck_id = "uspo"
cl_autoload = 0
ck_d_plugin = "postgresqldb"
cv_description = "   "

    [data.cct_params]
    connectString = "postgres://s_uc:s_uc@127.0.0.1:5432/uspo"
    poolMax = 50
```

2. Добавляем плагин ../t_plugins.toml


```
[[data]]
cv_name = "printjasperserver"
ck_d_provider = "all"
ck_d_plugin = "USPOIntegration"
cv_description = " "
cl_required = 0
cl_default = 0
cn_order = 3

  [data.cct_params]
  callBackUrl = http://127.0.0.1:8080
/api                                              --
  urlReceiver = http://127.0.0.1:7080/uspo-print-
receiver                  --     receiver
  prefixPath = "/reportserver"
  exportUrl = "c821e316-173d-4f71-b6a5-6a16f3bde6b3"
  queryNotification = "MTAddNotification"
```
