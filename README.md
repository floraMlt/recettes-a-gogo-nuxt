# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Modélisation

```mermaid
erDiagram
  User {
    String email
    String firstname
    String lastname
    Boolean is_admin
  }

  Recipe {
    String title
    String[] instructions
    Date created_at
    Date updated_at
    String description
    Number preparation_time
    Number cooking_time
    Enum category
    Boolean is_public
  }
  %% Enum values for Recipe.category:
  %% "starter" | "main" | "dessert" | "side" | "appetizer" | "drink"

  RecipeIngredient {
    Number quantity
    Enum unit
  }

  Ingredient {
    String title
    Enum unit
  }
  %% Enum values for Ingredient.unit:
  %% "unit" | "liter" | "centiliter" | "gram" | "kilogram" | 
  %% "tablespoon" | "teaspoon" | "pinch" | "bunch"

  Favorite {
    User user
    Recipe recipe
  }

  RecipeTag {
    Tag tag
    Recipe recipe
  }

  Tag {
    String name
  }

  User ||--o{ Favorite : belongs_to
  User ||--o{ Recipe : creates
  Recipe ||--o{ RecipeTag : relates_to
  Recipe ||--o{ RecipeIngredient : has
  Favorite }o--|| Recipe : targets
  RecipeTag }o--|| Tag : has
  RecipeIngredient }o--|| Ingredient : ""
  Ingredient }o--|| User : created_by
```