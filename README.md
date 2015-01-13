# Setup

- `bundle install`
- Create a copy of the file '.env.sample' named '.env.development'. Fill in relevant username/password for your installation of Postgres
- Do the same with 'env.test' and rename the database to _test instead of _development
- `rake ar:create`
- `rake ar:migrate`
- `RACK_ENV=test rake ar:create`
- `RACK_ENV=test rake ar:migrate`
