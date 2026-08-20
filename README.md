# The Daily Haul

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-5-FF4154?logo=reactquery&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)

A product catalog and shopping cart built with React, TypeScript, Redux Toolkit, and React Query, using [FakeStoreAPI](https://fakestoreapi.com/) as a mock backend. Built as part of Coding Temple's Frontend Specialization program.

## Overview

The Daily Haul lets you browse a live product catalog, search and filter it, and manage a shopping cart that persists across page refreshes. It was built specifically to practice combining two different state-management tools in one app: **React Query** for anything fetched from the server (products, categories), and **Redux Toolkit** for client-side state the app owns itself (the cart).

## Features

**Product catalog**

- Browse all products, fetched live from FakeStoreAPI via React Query
- Filter by category (populated dynamically from the API, not hardcoded)
- Search by product title
- Sort by price (low–high / high–low), name (A–Z / Z–A), or rating
- Filter, search, and sort selections are stored in the URL query string, so a filtered view can be refreshed, bookmarked, or shared
- Broken product images automatically fall back to a placeholder
- Click any product to view its full detail page

**Shopping cart**

- Add products to the cart from the catalog, a product's detail page, or the cart itself
- Adjust item quantity with +/− controls, or remove an item entirely
- Running totals for item count and price update live
- Cart persists in `sessionStorage`, surviving page refreshes within the same tab
- Checkout simulates a purchase by clearing the cart and showing a confirmation message
- A toast notification confirms each time an item is added to the cart

**Resilience**

- Product and category data is validated after fetching; malformed entries are filtered out rather than crashing the app
- Cart data loaded from `sessionStorage` is validated the same way, in case it was manually edited or corrupted
- Failed product/category requests show a clear error message with a "Try again" button

## Tech stack

| Purpose                         | Tool                                      |
| ------------------------------- | ----------------------------------------- |
| UI framework                    | React + TypeScript                        |
| Build tool                      | Vite                                      |
| Server state (fetching/caching) | TanStack React Query                      |
| Client state (cart)             | Redux Toolkit                             |
| Routing                         | React Router                              |
| Styling                         | Bootstrap + custom CSS                    |
| Data source                     | [FakeStoreAPI](https://fakestoreapi.com/) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/<your-username>/rrq-ecommerce-app.git
cd rrq-ecommerce-app
npm install
```

### Run the app

```bash
npm run dev
```

Then open the local URL shown in your terminal (typically `http://localhost:5173`).

## Project structure

```
src/
  api/            # Functions for talking to FakeStoreAPI
  app/            # Redux store setup and shared hooks
  components/     # Reusable UI pieces (Navbar, ProductCard)
  features/cart/  # Redux Toolkit cart slice
  pages/          # Home, Cart, and ProductDetail pages
  utils/          # Small shared helper functions
```

## Notes

- Product images point directly at FakeStoreAPI's hosted URLs. A small number of these return 404s (an API-side issue). When that happens, the app displays a [placehold.co](https://placehold.co) placeholder instead — a modern, actively maintained alternative to the `via.placeholder.com` service referenced in the original assignment brief, which has had reliability issues.
- Checkout is simulated. FakeStoreAPI doesn't support real order processing, so "checking out" clears the cart and shows a success message rather than submitting a real order.

## Author

Kathy Booth — [GitHub](https://github.com/kyrissian)
\*with contributions from Claude & CoPilot

Built as a graded project for Coding Temple's Frontend Specialization.
