from flask import Flask, send_from_directory, request, Response
import os

app = Flask(__name__)
PORT = 8000
BASE_DIR = r"E:\recordings"  # This should be the parent directory of `recordings`

@app.after_request
def add_headers(response):
    # Add CORS and range headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Range'
    response.headers['Accept-Ranges'] = 'bytes'
    return response

@app.route('/', defaults={'path': ''}, methods=['GET', 'OPTIONS'])
@app.route('/<path:path>', methods=['GET', 'OPTIONS'])
def serve_file(path):
    if request.method == 'OPTIONS':
        return Response(status=200)

    # Construct the full filesystem path
    full_path = os.path.join(BASE_DIR, path)

    # Handle directory listing
    if os.path.isdir(full_path):
        try:
            files = os.listdir(full_path)
        except PermissionError:
            return "Forbidden", 403

        # Generate directory listing HTML
        html = f"<html><body><h1>Directory listing for /{path}</h1><hr/><ul>"
        for f in files:
            # Construct the correct URL path
            if path:
                link_path = f"/{path}/{f}"
            else:
                link_path = f"/{f}"
            html += f'<li><a href="{link_path}">{f}</a></li>'
        return html + "</ul><hr/></body></html>"

    # Handle file requests
    mimetype = None
    if path.endswith(".m3u8"):
        mimetype = "application/vnd.apple.mpegurl"
    elif path.endswith(".ts"):
        mimetype = "video/MP2T"
    elif path.endswith(".mp4"):
        mimetype = "video/mp4"

    # Support partial content requests
    return send_from_directory(
        BASE_DIR,
        path,
        mimetype=mimetype,
        conditional=True
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
