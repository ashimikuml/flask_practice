import os
from time import sleep
from multiprocessing import Process

import flask
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)


@app.route("/")
def index():
    return "Hello, World!"

# アップロード
@app.route("/upload", methods=["GET", "POST"])
def upload():
    def allowed_file(filename):
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    if flask.request.method == 'POST':
        # check if the post flask.request has the file part
        if 'file' not in flask.request.files:
            flask.flash('No file part')
            return flask.redirect(flask.request.url)

        file = flask.request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flask.flash('No selected file')
            return flask.redirect(flask.request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return flask.redirect(flask.url_for('uploaded_file', filename=filename))

    return flask.render_template("upload.html")


@app.route('/upload/<filename>')
def uploaded_file(filename):
    return flask.send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route("/message/<msg>")
def message(msg):
    def save_message(msg):
        sleep(5)
        with open("message.txt", "w") as fout:
            fout.write(msg)

    # 別プロセスで実行 レスポンスを待たなくていい
    p = Process(target=save_message, args=(msg,))
    p.start()
    return msg


if __name__ == '__main__':
    app.run(debug=True)
