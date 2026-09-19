# Module system

[Русский](modules.md)

![Module system](images/p128-01.jpg)

Why modules are needed
How to add your own module
Additional capabilities
What a metamodel is
What global variables are
Which data types are available
Parameters that are passed into a module
How to use other modules in your modules
Loading a module (zip)


Why modules are needed
The module system is intended to extend the existing set of components by adding new
packages (modules) through the administration system or by changing existing classes.


How to add your own module
To add a module:

1. Implement the module as a separate package;
2. Use setComponent to install the component as a module;
3. … under development.


Additional capabilities
The constructor core uses react with dynamic data updates and the ability to change the theme

1. React - used to display data and manipulate DOM elements. The package must return a react component as a module; 2.

2. Mobx - a utility for managing application state in real time. With this utility you can react to changes in surrounding modules and propagate data from your module;
3. StoreBaseModel - a base model for creating a store for data exchange between the server and the client. It is also used to implement links via masters. Adds automatic data refresh when the master changes.
4. Material-ui - a utility for visualizing simple components and working with css. The application theme and color palette change system is built on this utility.
5. PageModel (PageStore) - the state store of the page the module is on. Provides access to other modules through the stores of other modules. Additionally stores open windows and the page visibility state.
6. ApplicationModel (ApplicationStore) - the common application store. Used to work with the authorization module and notifications. Stores information about all active pages in the application. Allows navigation between pages while providing information about the previous page via global variables.


What a metamodel is
The application metamodel is divided into 4 basic types:

1. Attributes - describe data types in the settings of a single class. Each attribute can be optional. When working with an attribute in a module, you must check that it contains data so as not to cause a critical error.
2. Classes - describe the state of a module. A class may include all attributes or some of them. The only required attribute is type, which is used to determine which module the class belongs to.
3. Objects - used to combine classes into a single object (for example: a table can include columns to build a table with the required columns for display). Nesting of objects inside other objects is defined at class creation. For each class, its attributes may be overridden.
4. Page - used to build a page (PageStore) from objects. For each class, its attributes may be overridden, and the override will be available only for the selected page. The same object can be added to several pages at once.


What global variables are
For communication between modules, a shared variable store is implemented (globalValues in PageStore).

The store allows you to:

1. Write data from any module (when the same key is used in different modules, data consistency is not guaranteed; all responsibility lies with the metamodel author).
2. Read data - keep in mind that the data type can be any: undefined, null, object, string, number, boolean, "array". When reading data, use reaction or autorun from mobx, or use mobx-react to subscribe the component's own render function to data changes.
3. Other operations on data - performed by calling ObservableMap methods.

Global variables can also change when navigating between pages via applicationStore


Which data types are available
For static typing and utilities, the constructor-share package is provided, which includes:

1. Data types for BuilderConfigType attributes. This structure is synchronized with the database and helps keep the code up to date.
2. ApplicationModelType - a data type for working with the application and authorization. Available through the module's pageStore.
3. PageModelType - stores the page state.


Parameters that are passed into a module
1. bc - BuilderConfigType stores the class state passed from the metamodel;
2. pageStore - the page state, described in the PageModelType type
3. hidden - (boolean) - content hiding state via metamodel rules
4. disabled - (boolean) - disabled state via metamodel rules
5. readOnly - (boolean) - "read-only" state via metamodel rules

6. visible - (boolean) - content display state on the page. If the page is not shown at all, visible will be false. Otherwise it is passed down the chain.

The hidden, disabled, readOnly, visible parameters can change depending on the states of intermediate components.


How to use other modules in your modules
To display child components, use mapComponents; you must always pass
pageStore and bc into each component for the other module to work correctly. You also need to pass disabled, hidden, readOnly,
visible down the chain; the values can be changed as needed or left as received for compatibility.


Loading a module (zip)
To deploy a module on a stand:

1. build with the yarn build command
2. create an archive for transfer with yarn zip

After creation, the archive will be available in the dist folder.

The zip file name is created using the template ${module-name}-${module-version}.zip

The module contains:

1. the source files of the module itself, located in dist
2. a manifest file stored at the project path src/schema_manifest.json


## USPO module




![USPO module](images/p130-01.jpg)

![USPO module](images/p137-01.jpg)

![USPO module](images/p137-02.jpg)

![USPO module](images/p138-01.jpg)

1. Introduction 1.1 Purpose 1.2 Definitions and abbreviations
2. System administrator qualification requirements
3. Purpose and conditions of use 3.1 Purpose 3.2 Conditions of use
4. Operation descriptions 4.1 Installing s3 storage 4.1.1 Installation 4.2 Deploying the database 4.2.1 Deploying the database 4.3 Installing Wildfly 4.3.1 Installing Wildfly 4.3.2 Connecting the Postgres JDBC module 4.3.3 Connecting the datasource 4.4 Deploying USPO 4.4.1 Installing web and receiver 4.4.2 Installing service 4.4.3 Connecting to CORE


1. Introduction

1.1 Purpose
This document contains the sequence of steps for deploying the “Universal Report Printing System”.


1.2 Definitions and abbreviations

Term Description

USPO Universal Report Printing System

ПО Software

ИР Information resources

АПК Hardware and software complex


2. System administrator qualification requirements
To maintain the System, the administrator must have the following skills:

Experience working on Linux servers or administering *nix-like systems;
Experience administering a PostgreSql 10+ database;

To support the System, the system administrator must:

Review the documentation of the manufacturers of the hardware and system software
used;


3. Purpose and conditions of use

3.1 Purpose
The “Universal Report Printing System” is a comprehensive solution for generating reports


3.2 Conditions of use
For the System to work, the following must be installed on the server in advance:

Software server

USPO DB server PostgreSQL 10+ DBMS

OS CentOs 7+

Report storage server OS CentOs 7+

Application server OS CentOs 7+

OpenJDK 11+


4. Operation descriptions

4.1 Installing s3 storage
riak cs — an open-source s3 storage implementation

riak kv — an open-source nosql DB


4.1.1 Installation

1. Add the riak repository /etc/yum.repos.d/basho.repo


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


2. Installing Riak KV

Run the installation
yum install riak

3. Installing Riak CS

Run the installation
yum install riak-cs

4. Installing Stanchion

Run the installation
yum install stanchion

5. Configure /etc/riak/advanced.config


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


6. Enable autostart for Riak KV

Show command

```
systemctl enable riak
```

7. Start Riak KV

Show command

```
systemctl start riak
```

8. Enable autostart for Stanchion

Show command

```
systemctl enable stanchion
```

9. Start Stanchion

Show command

```
systemctl start stanchion
```

10. Configure Riak CS /etc/riak-cs/riak-cs.conf


listener = 0.0.0.0:10011
anonymous_user_creation = on
admin.listener = 127.0.0.1:1101


11. Enable autostart for Riak CS

Show command

```
systemctl enable riak-cs
```

12. Start Riak CS

Show command

```
systemctl start riak-cs
```

13. Create users and save the credentials


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


14. Reconfigure /etc/riak-cs/riak-cs.conf


anonymous_user_creation = off
#admin.listener = 127.0.0.1:1101admin.key = LQPKAD2AUQIMU_RWF9KH
admin.secret = RLBTEONm_zr8nrAmQSge-kEt5P5qsKM9boYLPw==


15. Reconfigure /etc/stanchion/stanchion.conf


admin.key = LQPKAD2AUQIMU_RWF9KH
admin.secret = RLBTEONm_zr8nrAmQSge-kEt5P5qsKM9boYLPw==


16. Restart Stanchion

Show command

```
systemctl restart stanchion
```

17. Restart Riak CS

Show command

```
systemctl restart riak-cs
```

4.2 Deploying the database

4.2.1 Deploying the database

To deploy the System database on the USPO DB server, you must install the PostgreSQL DBMS.

1. Create users:

Superuser used to load the database:


```
CREATE ROLE s_su WITH
  LOGIN
  SUPERUSER
  INHERIT
  CREATEDB
  CREATEROLE
  NOREPLICATION;
```

User for gateway login:


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

User without the ability to authenticate, who will own functions and procedures:


```
CREATE ROLE s_up WITH
  NOLOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;
```

User for java login:


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

2. Create the DB container:


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

3. Unpack the archive and configure liquibase.uspo.properties


```
driver: org.postgresql.Driver
url: jdbc:postgresql://127.0.0.1:5432/uspo
username: s_su
password: s_su
```

4. Configure liquibase.meta.properties — it must point to the core DB.

5. Run update.


4.3 Installing Wildfly

4.3.1 Installing Wildfly

Installation is performed according to the guide https://docs.wildfly.org/17/Getting_Started_Guide.html


4.3.2 Connecting the Postgres JDBC module

Download https://jdbc.postgresql.org/download.html and unpack, for example, to /opt/pjdbc

Connect to wildfly


#cd /opt/wildfly-17.0.0.Final/#./bin/jboss-cli.sh
module add --name=org.postgresql --slot=main --resources=/opt/pjdbc
/postgresql-jdbc.jar —dependencies=javax.api,javax.transaction.api
connect
/subsystem=datasources/jdbc-driver=postgres:add(driver-name="postgres",
driver-module-name="org.postgresql",driver-class-name=org.postgresql.
Driver)

4.3.3 Connecting the datasource

1. Open wildfly administration


2. Create the uspo datasource, JNDI: java:jboss/datasources/print_server


4.4 Deploying USPO

USPO consists of:

web – an application that generates a report (war application)
receiver – an application that accepts requests and adds them to the queue (war application)
service – a queue processing application (jar application)


4.4.1 Installing web and receiver

Open administration


4.4.2 Installing service

1. Unpack, for example: /opt/uspo/service Configure /opt/uspo/service/uspo_print_service.properties


db.url=jdbc:postgresql://127.0.0.1:5432/uspo
db.user=uspo
db.pass=uspo
uspo.web.endpoint=http://127.0.0.1:8000/uspo-print-web
/print -- web


2. Configure /opt/uspo/service/daemon.sh


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

3. Configure startup

Show command

```
chmod +x /opt/uspo/service/daemon.sh
```

4. Configure the service /etc/systemd/system/uspo-service.service


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

5. Enable autostart

Show command

```
systemctl enable uspo-service
```

6. Connect to the uspo DB, edit the settings


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

7. Start the service

Show command

```
systemctl restart uspo-service
```

8.

8. Restart the applications in wildfly


4.4.3 Connecting to CORE

1. Add the provider ../t_providers.toml


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

2. Add the plugin ../t_plugins.toml


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
