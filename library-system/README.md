# Library System (Modular, Frontend/Backend Separated)

## Project Structure

- `server`: backend service (Express)
  - Reader module: register, update, query, cancel
  - Loan module: reader loan history and return toggle
  - Book module: list/create/update/discard/status
  - Category module: hierarchical category CRUD
  - Circulation module: borrow/return/loan list
  - Reports module: overview and hot books
  - System module: users/roles/backup skeleton
- `borrower`: borrower-side frontend (React + Vite)
  - `modules/readers`: reader center module
  - `modules/shared`: shared request layer
- `admin`: admin-side frontend (React + Vite, menu skeleton)
  - `modules/books`: books and categories management module
  - `modules/shared`: shared request layer
- root `package.json`: unified shortcut scripts

## Run Steps

1. Install backend dependencies:
   - `cd server`
   - `npm install`
2. Install borrower dependencies:
   - `cd ../borrower`
   - `npm install`
3. Install admin dependencies:
   - `cd ../admin`
   - `npm install`
4. Start backend:
   - `cd ../`
   - `npm run dev:server`
5. Start borrower frontend:
   - `npm run dev:borrower`
6. Start admin frontend:
   - `npm run dev:admin`

Default ports:
- Backend: `http://localhost:3000`
- Borrower frontend: `http://localhost:5173`
- Admin frontend: `http://localhost:5174` (if 5173 is occupied)

## Core Business Rules Implemented

- ID number must be unique.
- Card number is generated automatically (`LIB000001` ...).
- Reader can be cancelled only when no unreturned books exist.
- Loan history can be queried by reader card number.
