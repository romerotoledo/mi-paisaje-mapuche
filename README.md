# Mi paisaje mapuche

Juego educativo 3D para construir un paisaje mapuche y conocer elementos naturales, productivos, domésticos, ceremoniales y sociales.

Esta rama contiene un prototipo experimental de movimiento libre. Después de colocar una persona o un animal, se toca su figura para seleccionarla y luego se toca otra casilla para indicar el destino. Las personas y los animales terrestres buscan una ruta que evita el agua y las piezas que bloquean el paso; el cóndor y el halcón pueden sobrevolarlas.

Los chiliwekes, gallinas y otros animales pueden entrar en un malal al tocar la empalizada o el recinto comunitario como destino. Niñas, niños y otras personas pueden explorar el tablero y volver a la ruka. Un anillo amarillo identifica la figura seleccionada y otro verde muestra el destino. Las categorías están desbloqueadas desde el inicio para facilitar la prueba del prototipo.

Proyecto FONDECYT 1231127, dirigido por el Dr. Hugo Romero-Toledo, con identidad institucional de ANID y la Universidad Autónoma de Chile.

La escena conserva su estética isométrica *low-poly* y suma movimientos ambientales discretos: ondulación del agua, viento en árboles y foye, humo reciclado en los fogones, vuelos ocasionales del cóndor, movimientos breves del pudú y las gallinas, y entre dos y tres nubes según la capacidad del dispositivo. Las animaciones se pausan cuando la pestaña no está visible y respetan `prefers-reduced-motion`.

El malal se representa como un bloque cerrado de empalizada, por lo que no necesita controles de orientación. Su proximidad a animales y cultivos produce estados de protección orientadores, sin bloquear la construcción ni usar lenguaje bélico.

## Uso

No requiere instalación, compilación ni backend. Abre `index.html` desde un servidor web estático. En iPhone o iPad, toca para colocar piezas, arrastra para girar y pellizca para acercar o alejar.

`relations.js` contiene el motor de relaciones espaciales, separado de la interfaz para poder probarlo sin navegador. Usa distancia euclidiana sobre la cuadrícula: las celdas diagonales se consideran más cercanas que otras separadas por la misma cantidad de pasos ortogonales. El sistema orienta la ubicación de rukas, fauna, cultivos, espacios domésticos, malal y elementos ceremoniales, pero nunca impide experimentar.

La arquitectura ya reconoce los tipos futuros `swan`, `bandurria` y `frog` para fauna de humedal. Para incorporarlos habrá que añadir sus piezas y modelos a `index.html`; el motor los evaluará cerca de agua o humedal.

## Audio

La versión actual no contiene grabaciones de voz: el juego lee cada término exactamente como aparece escrito y elige la voz española mejor puntuada entre las disponibles en el dispositivo. Prioriza voces chilenas o latinoamericanas y variantes identificadas como naturales, mejoradas o premium, con velocidad y tono cercanos al habla normal. La disponibilidad y el timbre varían entre Safari, Chrome y cada sistema operativo.

Esta mejora evita separar o reemplazar sílabas, pero una voz española no reproduce necesariamente todos los sonidos del mapuzugun. La validación lingüística y una pronunciación auténtica requieren grabaciones de hablantes.

Cuando existan grabaciones validadas por hablantes, se podrán añadir sin bloquear el juego. Los nombres previstos para los términos nuevos son `assets/audio/foye.mp3` y `assets/audio/lonko.mp3`; estos archivos todavía no se cargan ni son obligatorios.

## Publicación

El workflow `Deploy static site to GitHub Pages` publica el contenido de la rama `main` en GitHub Pages. En la configuración del repositorio, selecciona **Settings → Pages → Source → GitHub Actions** si GitHub no lo hace automáticamente.

## Validación

Ejecuta:

```sh
node tests/validate.mjs
node tests/relations.test.cjs
```

Las pruebas revisan la sintaxis del JavaScript, los créditos institucionales, los recursos locales, el uso seguro de HTTPS, las categorías, los controles táctiles, la limpieza de animaciones y el comportamiento del motor espacial. La matriz de pruebas interactivas y las comprobaciones pendientes en dispositivos físicos están en `tests/manual-qa.md`.
