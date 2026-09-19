# Patching

[Русский](patching.md)

The patching module lets you transfer data from one CORE server to another. For example, you can transfer new
pages or users from a test server to production.

The CORE platform supports patching of:

metadata (pages/catalogs/modules, errors, services, localization);
internal authorization (actions, roles, users);
integration services.


## Authorization patching





![Authorization patching](images/p179-01.jpg)

![Authorization patching](images/p180-01.jpg)

![Authorization patching](images/p180-02.jpg)

![Authorization patching](images/p181-01.jpg)

![Authorization patching](images/p181-02.jpg)

![Authorization patching](images/p181-03.jpg)

This type of build is available only after the internal
authorization DB has been deployed. More Creating a plugin
Creating a build
Lets you create patches with the following data from the internal Build contents
authorization DB: Installation

Actions;
Roles;
Directory of additional user data;
Users.


Creating a plugin
To create builds you must create a patcher plugin.

1. Go to the "Gateway" page (CORE Administration Gateway);
2. Select the server for which the plugin will be created;
3. Go to the "Plugins" tab and click the "Add" button;
4. Fill in the fields in the window that appears:

5. Click the "Save" button;
6. Restart the gateway.


Creating a build
To create a patch:

1. Go to the "Authorization" page (CORE Patching Authorization);

2. Click the "Build" button;
3. in the window that appears, select the patch contents and click the "Save" button;


4. A build archive named "Patch_date_time.zip" will be created (for example: Patch_2020-02-07_14:15:26. zip)
5. You can download the archive by clicking the button:

6. The build contents are shown in child grids:


Build contents
Depending on the selected build parameters, the following files will be created in the Patch*.zip archive in the /auth folder:

What is selected File name What is exported

Actions Action.sql
the actions themselves
Action.sql.md5 role-to-action mapping


Roles Role.sql
the roles themselves
Role.sql.md5 role-to-action mapping
role-to-user mapping


Directory of additional user data Info.sql
the directory itself
Info.sql.md5 additional-data-to-user mapping


Users Account.sql
the users themselves
Account.sql.md5 roles and users


Installation
To install a build:

1. unpack the Patch_*.zip build archive;
2. in the liquibase.properties file, specify the correct DB host and port;


```
driver: org.postgresql.Driver
url: jdbc:postgresql://host:port/core_auth
username: s_su
password: s_su
```

3. run the update file.


## Metadata patching





![Metadata patching](images/p182-01.jpg)

![Metadata patching](images/p183-01.jpg)

![Metadata patching](images/p184-01.jpg)

![Metadata patching](images/p184-02.jpg)

![Metadata patching](images/p184-03.jpg)

![Metadata patching](images/p185-01.jpg)

![Metadata patching](images/p185-02.jpg)

Creating a plugin
Metadata patching lets you export the following Creating a build
data: Build contents
Installation
modules/catalogs/pages;
services;
errors;
localization dictionaries.


Creating a plugin
To create builds you must create a patcher plugin.

1. Go to the "Gateway" page (CORE Administration Gateway);
2. Select the server for which the plugin will be created;
3. Go to the "Plugins" tab and click the "Add" button;
4. Fill in the fields in the window that appears:


5. Click the "Save" button;

6. Restart the gateway.


Creating a build
To create a patch:

1. Go to the "Meta" page (CORE Patching Meta);


2. Click the "Build" button;
3. in the window that appears, select the patch contents and click the "Save" button;


4. A build archive named "Patch_date_time.zip" will be created (for example: Patch_2020-02-07_11:24:37. zip)
5. You can download the archive by clicking the button:

5.


6. The build contents are shown in child grids:


Build contents
Depending on the selected build parameters, the following files will be created in the Patch*.zip archive in the /meta folder:

What is selected File name What is exported

Page Page_"page_ID".sql
/Catalog The page itself and its view/edit actions;
/Module Page_"page_ID".sql. The catalog/module that contains the selected page;
md5 all objects on the page, their attributes, object master
links;
global variables on the page;
translations of words/phrases used on the page into all languages that
exist on the server from which the patch is taken + the languages themselves


Query_" Services used on the exported page
provider_name
".sql

Query_"
provider_name
".sql.md5

Service Query_" Selected services from t_query
provider_name
".sql

Query_"
provider_name
".sql.md5

Errors Message.sql
Selected errors from t_message
Message.sql.md5 translations of words/phrases from errors into all languages that exist on the server from
which the patch is taken + the languages themselves


Localization Localization_"language_code".
language sql the selected language
all translations of words and phrases for the selected language
Localization_"language_code".
sql.md5


Installation
To install a build:

1. unpack the Patch_*.zip build archive;
2. in the liquibase.properties file, specify the correct DB host and port;


```
driver: org.postgresql.Driver
url: jdbc:postgresql://host:port/core
username: s_su
password: s_su
```

3. run the update file.
