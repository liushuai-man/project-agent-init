import assert from "node:assert/strict";
import { existsSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export function validateLocalLink(root, source, href) {
  const target = href.split(/[?#]/)[0];
  if (!target) return;
  if (/^(https?:|mailto:)/i.test(target)) return;
  const decoded = decodeURIComponent(target);
  assert.ok(
    !/^[a-z]+:/i.test(decoded) && !isAbsolute(decoded),
    `引用必须是相对路径：${source} -> ${href}`,
  );
  const destination = resolve(dirname(source), decoded);
  const inside = (path) => {
    const rel = relative(realpathSync(root), path);
    return (
      rel === "" ||
      (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
    );
  };
  assert.ok(inside(destination), `引用越出 skill 目录：${source} -> ${href}`);
  assert.ok(existsSync(destination), `引用不存在：${source} -> ${href}`);
  assert.ok(
    inside(realpathSync(destination)),
    `引用通过链接越出 skill 目录：${source} -> ${href}`,
  );
}
