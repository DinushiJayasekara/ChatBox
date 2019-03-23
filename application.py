import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("send roomname")
def message(data):
    roomname = data["roomname"]
    emit("received roomname", {"roomname": roomname}, broadcast=True)

@socketio.on("send message")
def message(data):
    textMsg = data["textMsg"]
    roomName = data["roomName"]
    fileName = data["fileName"]
    emit("received message", {"textMsg": textMsg, 'roomName': roomName, 'fileName': fileName}, broadcast=True)
