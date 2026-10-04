"""Static server for the Klasse 5 app.  Usage: python3 serve.py [port] [bind]  (default 8790, 0.0.0.0)"""
import http.server, mimetypes, os, sys

mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("text/javascript", ".js")
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

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
