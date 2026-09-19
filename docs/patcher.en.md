# Patcher

Export metadata from the database to SQL for Liquibase.

[Русский](patcher.md)

## Prepare

1. DB release: https://github.com/essence-community/core-backend
2. Patcher: https://github.com/essence-community/core-backend/tree/master/patcher
3. Put the patcher on `PATH`.

## Platform (`core-backend/dbms`)

Point `liquibase.properties` at the database you dump from. Run commands from `core-backend/dbms`.

| What | Command | File |
| --- | --- | --- |
| `t_query` queries | `patcher -c query -qp ck_provider -p liquibase.properties` | `Querys_"provider name".sql` |
| System settings | `patcher -c syssetting -p liquibase.properties` | `MSysSettings.sql` |
| Messages (`t_message`, `ck_id` > 1000) | `patcher -c messages -p liquibase.properties` | `MMessages.sql` |
| Pages / catalogs / modules | `patcher -c page -o id_page -p liquibase.properties` | `Page_"id".sql` |
| Classes and attributes | `patcher -c class -p liquibase.properties` | `MetaClass.sql` |
| Localization | `patcher -c lang -p liquibase.properties` | `Localization_"lang id".sql` |
| One language | `patcher -c lang -o lang_code -p liquibase.properties` | `Localization_"lang id".sql` |

Files go to `core-backend/dbms/meta`.

New services: a line in `t_query/query.xml` (`<include file="./t_query/MTClass.sql" />`) and SQL under `t_query/`.

New pages/catalogs/modules: include in `meta/meta.xml`, modules first, then catalogs and pages.

## Internal authorization (`core-backend/dbms_auth`)

Point `liquibase.auth.properties` at the database. From `dbms_auth`:

```
patcher -c auth -p liquibase.auth.properties
```

Under `dbms_auth/meta/`:

- `Accoun.sql` — users
- `Action.sql` — actions
- `DInfo.sql` — extra user info
- `Roles.sql` — roles
