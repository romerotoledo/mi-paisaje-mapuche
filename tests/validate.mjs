import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(resolve(root, "index.html"), "utf8");

assert.match(html, /<!doctype html>/i);
assert.match(html, /<meta name="viewport"[^>]*viewport-fit=cover/i);
assert.match(html, /Proyecto FONDECYT 1231127/);
assert.match(html, /Dirigido por el Dr\. Hugo Romero-Toledo/);
assert.match(html, /assets\/institucional\/anid\.svg/);
assert.match(html, /assets\/institucional\/universidad-autonoma\.png/);
assert.doesNotMatch(html, /\bhttp:\/\//i, "Todos los recursos de red deben usar HTTPS");

for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
  const url = match[1];
  if (/^(?:https?:)?\/\//i.test(url)) {
    assert.match(url, /^https:\/\//i, `Recurso inseguro: ${url}`);
  }
}

for (const asset of [
  "relations.js",
  "assets/institucional/anid.svg",
  "assets/institucional/universidad-autonoma.png",
]) {
  await access(resolve(root, asset));
}

const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
assert.ok(inlineScripts.length > 0, "No se encontró JavaScript embebido");
for (const [, source] of inlineScripts) {
  new Function(source);
}

for (const eventName of ["touchstart", "touchmove", "touchend", "touchcancel"]) {
  assert.match(html, new RegExp(`addEventListener\\(['"]${eventName}['"]`));
}

assert.match(html, /function paintGround\(i,k,type\)/);
assert.match(html, /pieces\[selected\]\.kind==='block'/);
assert.match(html, /op:'paint'/);
for (const id of ["woman", "man", "girl", "boy", "elder"]) {
  assert.match(html, new RegExp(`${id}:\\{cat:'social'`));
}
for (const id of ["machi", "lonko", "rewe", "kultrun", "kuel", "foye"]) {
  assert.match(html, new RegExp(`${id}:\\{cat:'ceremonial'`));
}
assert.doesNotMatch(html, /(?:machi|lonko):\{cat:'social'/);
assert.doesNotMatch(html, /child:\{cat:'social'/);
assert.match(html, /mapu:'Lonko',es:'Autoridad comunitaria'/);
assert.match(html, /mapu:'Foye',es:'Canelo'/);
assert.match(html, /function palisade\(\)/);
assert.match(html, /es:'Empalizada'/);
assert.match(html, /fort:\{cat:'arquitectura'/);
assert.match(html, /mapu:'Malal',es:'Recinto comunitario'/);
assert.doesNotMatch(html, /recinto fortificado|fortificación|comprender la defensa/i);
assert.match(html, /type==='fort'/);
assert.match(html, /function pronounce\(id\)/);
assert.match(html, /SpeechSynthesisUtterance/);
assert.match(html, /function startMusic\(\)/);
assert.match(html, /guía sintetizada aproximada/);
assert.match(html, /src="\.\/relations\.js"/);
for (const fn of [
  "getObjectsByType", "getObjectsByCategory", "gridDistance", "isNear",
  "isNearAny", "countNearby", "getNearbyObjects", "evaluateMalalProtection",
  "evaluateLandscapeRelations", "getRelationScore", "showLandscapeFeedback",
]) {
  assert.match(html, new RegExp(`function ${fn}\\(`), `${fn} debe existir`);
}
assert.doesNotMatch(html, /id="turnPiece"/);
assert.doesNotMatch(html, /pieceRotation/);
assert.match(html, /j=1,k=/);
assert.match(html, /Ese espacio ya está ocupado/);
assert.match(html, /prefers-reduced-motion: reduce/);
assert.match(html, /visibilitychange/);
assert.match(html, /function registerAnimation\(/);
assert.match(html, /function animateEntry\(/);
assert.match(html, /function createClouds\(/);
assert.match(html, /function resetClouds\(/);
assert.match(html, /const smokeGeometry=/);
assert.match(html, /clearIndicatorsForMesh\(r\.mesh\)/);
assert.match(html, /animated\.splice\(a,1\)/);
assert.match(html, /renderer\.shadowMap\.enabled=false/);
assert.match(html, /Math\.min\(devicePixelRatio,1\.2\)/);
assert.doesNotMatch(html, /setPointerCapture/);
assert.doesNotMatch(html, /\.ctrl\{width:(?:4[0-3]|[0-3]\d)px;height:/, "Los controles deben medir al menos 44 px");
const animationSource=html.slice(html.indexOf("function animateEntry"),html.indexOf("function place"));
assert.doesNotMatch(animationSource,/new THREE\./,"El ciclo de animación no debe crear geometrías ni materiales");

console.log("OK: HTML estático, relaciones, animaciones reutilizables, audio, recursos y controles táctiles validados.");
