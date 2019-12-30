# Сохранение базы на локальном диске

Добавляем в docker-compose.yml в блок postgres в volumes:

`- '/home/db:/var/lib/postgresql/data'`

`/home/db` - папка на локальном диске