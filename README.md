# Quiz api

This is an api to create quizzes 🧠

## How to run

Firstly you will need a Postgres database you can use the docker-compose.yaml
(to use this file you will need to configure the secrets you can find more
information [here](https://docs.docker.com/compose/use-secrets/)) in this
repository to do this, after that you just need to run the script.sql (available
in /docs/script.sql) and `deno task dev`.

## Environment variables

| Name                  |                                                                  Meaning                                                                  |
| --------------------- | :---------------------------------------------------------------------------------------------------------------------------------------: |
| BASE_URL              |                                                          The base url of the api                                                          |
| CLOUDINARY_CLOUD_NAME |                                                         Cloud name on Cloudinary                                                          |
| CLOUDINARY_API_KEY    |                                                            Cloudinary api key                                                             |
| CLOUDINARY_API_SECRET |                                                           Cloudinary api secret                                                           |
| DB_USER               |                                                               Database user                                                               |
| DB_PASSWORD           |                                                             Database password                                                             |
| DB_HOST               |                                                               Database host                                                               |
| DB_PORT               |                                                               Database port                                                               |
| DB_SSL_CERT           | Database ssl cert (The value need to be in base64) with you dont need a ssl cert you will need to edit the src/config/db/database.ts file |

## Documentation

You can find the documention in the follow endpoints: `/v1/doc` (OpenApi) or
`/v1/doc/ui` (SwaggerUI)

## To Do

- [] Improve the API so that tests are database independent.
