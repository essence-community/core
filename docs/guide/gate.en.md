# Gateway

[Русский](gate.md)

Catalog describing gateway settings and the middle layer


## How the gateway works

![How the gateway works](images/p119-01.jpg)

Sequence of operation.

1. A user request arrives at the context plugin.
2. The context plugin checks access, caches pages, and initializes data for a subsequent call to a data provider, or immediately returns a result for the response. The context chooses which provider should execute the request.
3. The provider plugin initializes the request and executes it to obtain data. That is, the provider works in a straightforward way: it receives a request, passes it to the DB/bus/another gateway, gets a response, and returns it to the context.
4. If needed, the provider calls a plugin or plugins. Data plugins run during the provider stage. If the provider needs to modify the request or response, an additional plugin is involved. For example, when printing reports the Provider calls the corresponding USPO plugins to unpack JSON, pass it to Jasper, and transform the response from Jasper.
5. The data is returned to the user.

Methods can be implemented at any stage of the call.

You can read more about each plugin here


## Gateway plugins

![Gateway plugins](images/p120-01.jpg)

Creation Creation
Context plugins
Plugins are created by implementing abstract classes: CoreOracleContext
CoreOracleIntegrati
onContext
NullContext - abstract class for context plugins Provider plugins
NullPlugin - abstract class for authorization data plugins
NullProvider - abstract class for data provider plugins AuthCrmWs
NullAuthProvider - abstract class for authorization provider plugins CoreAuthPG
NullScheduler - abstract class for scheduler plugins PKOAuth
NullEvent - abstract class for autonomous services AdAuth
Provider plugins
AdminGate
CoreOracleIntegrati
Context plugins on
OracleDb
PostgreSQLDb
CoreOracleContext Data plugin
JsonRowColumnExt
CORE context plugin. ractor
PrepareQueryPlugin
This plugin caches access rights, pages, errors, and queries. USPOIntegration
Access is checked. A ready page is returned from cache.
The main settings relate to the DB.

Settings


Parameter name Description

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


CoreOracleIntegrationContext
Plugin for initializing BFL integration with external services.

This plugin caches access rights and queries.

Settings


Parameter name Description

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


Authorization provider plugins

AuthCrmWs
SUVK authorization plugin via the bus.

Settings


Parameter Description
name

queryAuth Name of the authorization check query

queryMetaUsers Name of the query that retrieves meta information

queryUsersActions Name of the query that retrieves all actions

queryUsersDepartments Name of the query that retrieves departments by
user

queryDepartments Name of the query that retrieves all departments

queryToken Name of the query that retrieves a token

queryGetCrmUrl Name of the query that retrieves the SUVK link

cronReset Time when the cache is reset. Linux crontab format: * *
****

cnSystem System ID

clAudit Audit flag

sessionDuration Session lifetime

urlCrmTemplate Link template

nsiGateUrl NSI gate URL


AuthMock
Plugin that implements an authorization stub for new projects.

Settings


Parameter name Description

adminPassword Administrator password

adminUser Administrator account name

viewUser View account name


ProjectTiiAuth
Authorization plugin for project accounting.

Settings


Parameter name Description

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


CoreAuthOracle
Authorization plugin for the Core structure

Settings


Parameter name Description

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


CoreAuthPG
Authorization plugin for the Core structure

Settings


Parameter name Description

connectString Database connection string

poolMax Maximum number of DB connections in the pool


PKOAuth
PKO authorization plugin; a combination of CoreAuth and AdAuth

Settings


Parameter name Description

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


Parameter name Description

adBaseDN LDAP search base.
Example: dc=example,dc=com

adDefaultAction Default action list.
Example: 150,250,300

adLogin Login of the LDAP access account

adMapGroups Mapping of user groups and actions.
Example:
NameGroup=900,200;NameGroup=100,
215

adMapUserAttr Mapping of user attributes.
Example: cv_login=sAMAccountName;
cv_name=cn;cv_surname=sn;
cv_email=mail;cv_cert=userCertificate

adPassword Password of the LDAP access account

adUrl LDAP URL. Example: Example: ldap://dc.
domain.com


AdAuth
ActiveDirectory authorization plugin

Settings


Parameter name Description

adBaseDN LDAP search base.
Example: dc=example,dc=com

adDefaultAction Default action list.
Example: 150,250,300

adLogin Login of the LDAP access account

adMapGroups Mapping of user groups and actions.
Example:
NameGroup=900,200;NameGroup=100,
215

adMapUserAttr Mapping of user attributes.
Example: cv_login=sAMAccountName;
cv_name=cn;cv_surname=sn;
cv_email=mail;cv_cert=userCertificate

adPassword Password of the LDAP access account

adUrl LDAP URL. Example: Example: ldap://dc.
domain.com


Provider plugins

AdminGate
Gateway administration plugin.

Settings


Parameter name Description

cv_riak_url Riak storage URL

cct_buckets Storage settings in JSON format


CoreOracleIntegration
Plugin for BFL integration with external systems.

Settings


Parameter Description
name

timeout External service timeout

needSession Whether authorization must be checked for requests

proxy Proxy server for calling external systems (if
needed)

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


OracleDb

Plugin for executing queries against an Oracle DB.

Settings


Parameter name Description

core mode with temporary table initialization

user Database account name

password Database account password

connectString Database connection string

poolMin Minimum number of DB connections in the pool

poolMax Maximum number of DB connections in the pool


PostgreSQLDb
Plugin for executing queries against a Postgres DB.

Settings


Parameter name Description

core Initialization according to the CORE schema

connectString Database connection string

poolMax Maximum number of DB connections in the pool


Data plugin

JsonRowColumnExtractor
Unpacks the response from specified columns of a row into JSON.

Settings
One of the following is used:

Parameter name Description

columns Names of columns that must be
unpacked (comma-separated)

extractSingleColumn Flag indicating that a column must be
unpacked (if it is a single column, is a
string, and starts with { or [ )


PrepareQueryPlugin
Query modification, applying filters.


USPOIntegration
Printing plugin via USPO.

Settings


Parameter Description
name

timeout Timeout

urlReceiver URL JS

prefixPath Path prefix for forming the download
link

queryNotification Name of the notification query

maxExcelRows Maximum number of rows when printing to Excel

exportUrl UUID of the Excel report


## For the developer

Repository
Repository structure
Repository Getting started
Building the application
https://github.com/essence-community/core-backend


Repository structure
source
- cert Certificates for building a secure cluster channel
- contexts Context plugins
- events Notification service and autonomous service plugins
- libs Libraries
- plugininf Package of common plugin classes and interfaces
- plugins Data processing and modification plugins
- providers Data retrieval plugins
- resources Settings
- schedulers Scheduler plugins
- server Server implementation
- admin cluster administration process implementation
- core common classes
- events autonomous services process implementation
- http HTTP server cluster implementation
- localDbNode local NeDb process implementation
- master main controlling process implementation
- schedulers scheduler process implementation


Getting started
For development you need to install Node 10+ and yarn 1.9+.
To work with Oracle you must install a client (with the same bitness as Node.js) not
lower than 12.2 and add it to PATH. (Instant Client will do).
Install all dependencies from the source folder:


```
yarn install
```

Building the application

Go to the source folder and run:


```
yarn build
```

It will build into the bin folder


## Notification system

![Notification system](images/p127-01.jpg)

The CORE platform implements a notification system that consists of three parts:

semaphores;
notifications from a Postgres DB;
notifications from an Oracle DB.

Semaphores are a message that the system is unavailable (for example, when the cache is reset).

The t_semaphore table is analyzed. If cn_value <> 0, a message about technical maintenance is displayed.

This type of message is shown to all authorized users.


Notifications from the DB (Oracle/Postgres) are messages about system errors and warnings.

The t_notification table is analyzed. When a record is added to t_notification, the DB notifies the gateway.

This table stores the date when the error/warning occurred, the ID of the user who received
the error, a sent flag, and message data (the error code from t_message, dynamic text macros, the page ID, and the ID
of the object on the page that returned the error). This type of notification is shown personally: only to the
user who invoked the failed operation.


Example


cv_message

{"cv_error":{"47":["1_1"]},"reloadpageobject":{"ck_page":"541810","ck_page_object":"
7BE1EFFCAA306BBDE053809BA8C0AD87"}}

Message type: error (error), warning (warning), or informational message (info) — determined for each
error code in the t_message table (cr_type).

All messages/errors/warnings are displayed in the Notification panel according to their type.


Notification system settings are specified in the t_events.yaml configuration file.


More about error handling here
