"""Static server for the Klasse 5 app.  Usage: python3 serve.py [port] [bind]  (default 8790, 0.0.0.0)"""
import http.server, mimetypes, os, re, subprocess, sys, time

mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("text/javascript", ".js")
ROOT = os.path.dirname(os.path.abspath(__file__))


def _version():
    try:
        return subprocess.check_output(["git", "-C", ROOT, "rev-parse", "--short", "HEAD"], text=True).strip()
    except Exception:
        return str(int(time.time()))


# Every page load pins its local .js/.css to this version (?v=…), so a browser can never mix a fresh
# page with a stale cached engine/unit from an older deploy. Changes on each restart (deploy restarts).
VERSION = _version()
_ASSET = re.compile(r'((?:src|href)=")((?![a-z]+:|/)[^"?#]+\.(?:js|css))"')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def do_GET(self):
        path = self.translate_path(self.path.split("?", 1)[0])
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        if not path.endswith(".html") or not os.path.isfile(path) or not self.path.split("?", 1)[0].endswith(("/", ".html")):
            return super().do_GET()
        with open(path, encoding="utf-8") as f:
            body = _ASSET.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={VERSION}"', f.read()).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # Short cache so updates (git pull) show up quickly on the iPad.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, *a):
        pass


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8790
    bind = sys.argv[2] if len(sys.argv) > 2 else "0.0.0.0"
    print(f"Klasse 5 on http://{bind}:{port}/", flush=True)
    Server((bind, port), Handler).serve_forever()
