# Client rabbitmq nodejs

## How to use

- Intall dependencies `npm install` or `yarn`
- Change `.env` file with ur server rabbitmq
- Run nodejs `npm run start` or `yarn start`

### Create todo

will listening on channel `req.create.todo` after it will make publish channel `todo.created` with message same in save db

### Get todo

open url e.g `http://localhost:3000/`

### Delete todo

will listening on channel `req.delete.todo` after it will make publish channel `todo.deleted` with message detail deleted item.
