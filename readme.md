# sos-app

> sos app

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/sos-app
    npm install
    ```

3. Start your app

    ```
    npm run bootstrap # Run creating database if none
    npm run migrate # Run migrations to set up the database
    npm start # Run two previous scripts and start app
    ```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Swagger-UI

Swagger is available at ```/docs``` path

## Запустить в докере для разработки

Переключиться на ветку `develop`

```
$ git switch develop
```

В корне должен лежать `.env` файл.

В папке `./config` должен лежать файл конфигурации `firebase`

Также вручную создать в проекте папку `/public/uploads/avatars`

```
$ docker compose -f docker-compose.development.yml --env-file .env up -d --build
```

После билда и запуска контейнера нужно вручную создать базу данных с соответствующим `.env` именем и паролем, а также выполнить миграции изнутри самого контейнера

```
$ docker exec -it sos_api bash
/usr/src/app# npm run migrate
```

Для большинства запросов требуется токен авторизации.

Для этого нужно выпонить следующие запросы из коллекции `Postman`:

`/Registration Service/signup` - зарегистрировать аккаунт

`/Positive Flow Consequence/patient login` - залогиниться

В регистрации уже есть нужный объект в теле запроса, нужно только подставить значения в соответствующие переменные. Токен автоматически подкинется в заголовок остальных запросов.