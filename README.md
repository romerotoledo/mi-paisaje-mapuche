# Mi paisaje mapuche

Juego educativo 3D para construir un paisaje mapuche y conocer elementos naturales, productivos, domésticos, ceremoniales y sociales.

Proyecto FONDECYT 1231127, dirigido por el Dr. Hugo Romero-Toledo, con identidad institucional de ANID y la Universidad Autónoma de Chile.

## Uso

No requiere instalación, compilación ni backend. Abre `index.html` desde un servidor web estático. En iPhone o iPad, toca para colocar piezas, arrastra para girar y pellizca para acercar o alejar.

## Publicación

El workflow `Deploy static site to GitHub Pages` publica el contenido de la rama `main` en GitHub Pages. En la configuración del repositorio, selecciona **Settings → Pages → Source → GitHub Actions** si GitHub no lo hace automáticamente.

## Validación

Ejecuta:

```sh
node tests/validate.mjs
```

La prueba revisa la sintaxis del JavaScript, los créditos institucionales, los recursos locales y el uso seguro de HTTPS.
