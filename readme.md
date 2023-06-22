# Digital Cow Hut Backend

## Live Link

[https://digital-cow-hut-kappa.vercel.app/]

## Application Routes

### User

- `POST` api/v1/auth/signup
- `GET` api/v1/users
- `GET` api/v1/users/6177a5b87d32123f08d2f5d4 (Single GET)
- `PATCH` api/v1/users/6177a5b87d32123f08d2f5d4 (Single Update)
- `DELETE` api/v1/users/6177a5b87d32123f08d2f5d4 (Single Delete)

### Cows

- `POST` api/v1/cows
- `GET` api/v1/cows
- `GET` api/v1/cows/6177a5b87d32123f08d2f5d4 (Single GET)
- `PATCH` api/v1/cows/6177a5b87d32123f08d2f5d4 (Single Update)
- `DELETE` api/v1/cows/6177a5b87d32123f08d2f5d4 (Single Delete)

### Pagination and Filtering routes of Cows

- `GET` api/v1/cows?pag=1&limit=10
- `GET` api/v1/cows?sortBy=price&sortOrder=asc
- `GET` api/v1/cows?minPrice=20000&maxPrice=70000
- `GET` api/v1/cows?location=Chattogram
- `GET` api/v1/cows?searchTerm=Cha

### Orders

- `POST` api/v1/orders (Place a new order)
- `GET` api/v1/orders (Get all the orders)
