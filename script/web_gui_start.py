#!/usr/bin/env python3
import http.server
import socketserver
import os
import signal
import sys

PORT = 8000
DIRECTORY = os.path.join(os.path.dirname(__file__), '../html')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def signal_handler(sig, frame):
    print("\nServer is shutting down...")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

httpd = None

try:
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer interrupted by user")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if httpd:
        httpd.server_close()
        print("Server closed")
