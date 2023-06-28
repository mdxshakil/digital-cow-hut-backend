# Digital Cow Hut Backend

## Live Link

---

[https://digital-cow-hut-a4.vercel.app/]

## Application Routes

---

### Auth (User)

- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/auth/login
- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/auth/signup
- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/auth/refresh-token

### Auth (Admin)

- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/admins/create-admin
- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/admins/login

### User

- `GET` https://digital-cow-hut-a4.vercel.app/api/v1/users
- `SINGLE GET` https://digital-cow-hut-a4.vercel.app/api/v1/users/64946cc9bb1e28c1364e33d9
- `PATCH` https://digital-cow-hut-a4.vercel.app/api/v1/users/64946cc9bb1e28c1364e33d9
- `DELETE` https://digital-cow-hut-a4.vercel.app/api/v1/users/64946cc9bb1e28c1364e33d9

### Cows

- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/cows
- `GET` https://digital-cow-hut-a4.vercel.app/api/v1/cows
- `SINGLE GET` https://digital-cow-hut-a4.vercel.app/api/v1/cows/6496566fcddf30cd2116be43
- `PATCH` https://digital-cow-hut-a4.vercel.app/api/v1/cows/6496566fcddf30cd2116be43
- `DELETE` https://digital-cow-hut-a4.vercel.app/api/v1/cows/6496566fcddf30cd2116be43

### Orders

- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/orders
- `GET` https://digital-cow-hut-a4.vercel.app/api/v1/orders

## Bonus Part

---

### Admin

- `POST` https://digital-cow-hut-a4.vercel.app/api/v1/admins/create-admin

### My Profile

- `GET` https://digital-cow-hut-a4.vercel.app/api/v1/users/my-profile
- `PATCH` https://digital-cow-hut-a4.vercel.app/api/v1/users/my-profile

### Order

- `GET` https://digital-cow-hut-a4.vercel.app/api/v1/orders/64965a3f1f3874741068afee
