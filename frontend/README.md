## Environment
Node==v22.15.0 (npm v10.9.2)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Create .env file

``` bash
cp .env.example .env
```
or
- .env.development
```
VITE_API_BASE_URL=https://localhost:8000/
```
- .env.production
```
VITE_API_BASE_URL="your_production_api_base_url"
```


### Compile and Hot-Reload for Development

```sh
npm run dev
```

### APP URL
https://localhost:5173/

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
