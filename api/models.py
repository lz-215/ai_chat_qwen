from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.set_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        try:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            
            response_data = {
                "model": "qwen-plus",
                "api_type": "Qwen API",
                "status": "API mode",
                "device": "Qwen Cloud"
            }
            
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
