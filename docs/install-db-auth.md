# БД внутренней авторизации

Делается после развёртывания платформы ([install.md](install.md)).

## Развёртывание БД

1. Распаковать архив `dbms_auth*` из релиза.
2. Выполнить скрипт создания БД (`db.sql` из папки `s_su`).
3. В `liquibase.meta.properties` указать БД платформы:

```
driver: org.postgresql.Driver
url: jdbc:postgresql://host:port/core
username: s_su
password: s_su
```

4. В `liquibase.auth.properties` указать БД авторизации:

```
driver: org.postgresql.Driver
url: jdbc:postgresql://host:port/core_auth
username: s_su
password: s_su
```

5. Запустить `update`.

## Переключение на `core_auth`


![Провайдер authcore](images/db-auth-p02-01.jpg)


![Плагины и вход](images/db-auth-p03-01.jpg)

![Плагины и вход](images/db-auth-p03-02.jpg)

![Плагины и вход](images/db-auth-p03-03.jpg)

По умолчанию авторизация идёт через провайдер-заглушку `auth`.

1. Страница «Шлюз» (Меню → CORE → Администрирование → Шлюз).
2. Выбрать сервер.
3. Вкладка «Настройка провайдеров».
4. Создать провайдера `authcore`. Строка подключения:

```
postgres://s_ac:s_ac@postgres:5432/core_auth
```

5. Вкладка «Плагины»: добавить `jsonrowcolumnextractor` и `preparequery`.
6. Перезапустить шлюз.
7. Логин по умолчанию: `admin_core` / `admin_core`.
8. Сменить пароль: Меню → CORE → Авторизация → Пользователи.
