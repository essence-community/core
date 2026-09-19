# Патчер

Выгрузка метаданных из БД в SQL для Liquibase.

## Подготовка

1. Релиз БД: https://github.com/essence-community/core-backend
2. Патчер: https://github.com/essence-community/core-backend/tree/master/patcher
3. Прописать патчер в `PATH`.

## Платформа (`core-backend/dbms`)

В `liquibase.properties` указать БД, с которой снимается дамп. Команды запускать из `core-backend/dbms`.

| Что | Команда | Файл |
| --- | --- | --- |
| Запросы `t_query` | `patcher -c query -qp ck_provider -p liquibase.properties` | `Querys_"имя провайдера".sql` |
| Системные настройки | `patcher -c syssetting -p liquibase.properties` | `MSysSettings.sql` |
| Ошибки (`t_message`, `ck_id` > 1000) | `patcher -c messages -p liquibase.properties` | `MMessages.sql` |
| Страницы / каталоги / модули | `patcher -c page -o id_page -p liquibase.properties` | `Page_"ид".sql` |
| Классы и атрибуты | `patcher -c class -p liquibase.properties` | `MetaClass.sql` |
| Локализация | `patcher -c lang -p liquibase.properties` | `Localization_"ид языка".sql` |
| Один язык | `patcher -c lang -o код_языка -p liquibase.properties` | `Localization_"ид языка".sql` |

Файлы пишутся в `core-backend/dbms/meta`.

Новые сервисы: строка в `t_query/query.xml` (`<include file="./t_query/MTClass.sql" />`) и SQL в `t_query/`.

Новые страницы/каталоги/модули: include в `meta/meta.xml`, сначала модули, потом каталоги и страницы.

## Внутренняя авторизация (`core-backend/dbms_auth`)

В `liquibase.auth.properties` указать БД. Из папки `dbms_auth`:

```
patcher -c auth -p liquibase.auth.properties
```

В `dbms_auth/meta/`:

- `Accoun.sql` — пользователи
- `Action.sql` — действия
- `DInfo.sql` — доп. информация пользователя
- `Roles.sql` — роли
