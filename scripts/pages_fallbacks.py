# Usage: python3 pages_fallbacks.py <built site dir>
# GitHub Pages has no SPA rewrite: give each client route a real index.html, and 404.html for the rest.
import json, pathlib, shutil, sys
site = pathlib.Path(sys.argv[1])
index = site / "index.html"
routes = ["profile", "blog"]
routes_file = site / "manus-routes.json"
if routes_file.exists():
    data = json.loads(routes_file.read_text())
    items = data if isinstance(data, list) else data.get("routes", [])
    for r in items:
        path = (r if isinstance(r, str) else r.get("path", "")).strip("/")
        if path and ":" not in path and "*" not in path:
            routes.append(path)
# Concrete blog article and category pages from the blog data (passed as optional 2nd arg).
if len(sys.argv) > 2:
    import re
    blog = pathlib.Path(sys.argv[2]).read_text()
    routes += [f"blog/{x}" for x in re.findall(r"slug:\s*['\"]([a-z0-9-]+)['\"]", blog)]
    routes += ["category/" + c.lower().replace(" ", "-") for c in re.findall(r"category:\s*['\"]([^'\"]+)['\"]", blog)]
for r in sorted(set(routes)):
    d = site / r
    d.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(index, d / "index.html")
shutil.copyfile(index, site / "404.html")
(site / ".nojekyll").write_text("")
print("route pages:", sorted(set(routes)))
