# Internal authorization database

Do this after deploying the platform ([install.en.md](install.en.md)).

[Русский](install-db-auth.md)

## Deploy the database

1. Unpack the `dbms_auth*` archive from the release.
2. Run the auth DB creation script (`db.sql` in `s_su`).
3. In `liquibase.meta.properties` set the platform database:

```
driver: org.postgresql.Driver
url: jdbc:postgresql://host:port/core
username: s_su
password: s_su
```

4. In `liquibase.auth.properties` set the auth database:

```
driver: org.postgresql.Driver
url: jdbc:postgresql://host:port/core_auth
username: s_su
password: s_su
```

5. Run `update`.

## Switch to `core_auth`

![authcore provider](images/db-auth-p02-01.jpg)

![Plugins and login](images/db-auth-p03-01.jpg)

![Plugins and login](images/db-auth-p03-02.jpg)

![Plugins and login](images/db-auth-p03-03.jpg)

By default CORE authenticates through the stub provider `auth`.

1. Open **Gateway** (Menu → CORE → Administration → Gateway).
2. Select the server.
3. Open the **Provider settings** tab.
4. Create the `authcore` provider. Connection string:

```
postgres://s_ac:s_ac@postgres:5432/core_auth
```

5. **Plugins** tab: add `jsonrowcolumnextractor` and `preparequery`.
6. Restart the gateway.
7. Default login: `admin_core` / `admin_core`.
8. Change the password: Menu → CORE → Authorization → Users.
