from flask import Flask, jsonify, request, Response
from CONSTANTS import SMTP_PORT, SMTP_SERVER, CONVEYOR_EMAIL, PASSWORD
import smtplib, ssl
import os.path

# http://vocent.pythonanywhere.com/
app = Flask(__name__)
  
@app.route('/', methods = ['POST'])
def home():
    if(request.method == 'POST'):
        receiver_email = request.json["receiver_email"]
        message = """\
                    Subject: From Vocent

                    """ + request.json["message"]
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(CONVEYOR_EMAIL, PASSWORD)
                server.sendmail(CONVEYOR_EMAIL, receiver_email, message)
            return jsonify({'data': 'Mail sent successfully'})
        except Exception as e:
            return jsonify({'message':'Error Occured',
            "data":str(e)})


def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))


def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)

@app.route('/',methods=['GET'], defaults={'path': 'index.html'})
@app.route('/<path:path>')
def get_resource(path):  # pragma: no cover
    mimetypes = {
        ".css": "text/css",
        ".html": "text/html",
        ".js": "application/javascript",
    }
    complete_path = os.path.join(root_dir(), path)
    ext = os.path.splitext(path)[1]
    mimetype = mimetypes.get(ext, "text/html")
    content = get_file(complete_path)
    return Response(content, mimetype=mimetype)


if __name__ == '__main__':
  
    app.run(debug = True)
