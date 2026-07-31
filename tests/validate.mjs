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
assert.match(html, /lonko:\{cat:'social'/);
assert.match(html, /function palisade\(\)/);
assert.match(html, /es:'Empalizada'/);
assert.match(html, /fort:\{cat:'arquitectura'/);
assert.match(html, /mapu:'Malal',es:'Fuerte'/);
assert.match(html, /type==='fort'/);
assert.match(html, /function pronounce\(id\)/);
assert.match(html, /SpeechSynthesisUtterance/);
assert.match(html, /function startMusic\(\)/);
assert.match(html, /guía sintetizada aproximada/);
assert.doesNotMatch(html, /id="turnPiece"/);
assert.doesNotMatch(html, /pieceRotation/);
assert.match(html, /j=1,k=/);
assert.match(html, /Ese espacio ya está ocupado/);
assert.match(html, /baseRotation:mesh\.rotation\.y/);
assert.match(html, /a\.mesh\.position\.y=a\.baseY;/);
assert.doesNotMatch(html, /a\.mesh\.position\.y=a\.baseY\+/);

console.log("OK: HTML estático, Malal fuerte, pronunciación guiada, música original, recursos, controles táctiles y sintaxis JavaScript validados.");
