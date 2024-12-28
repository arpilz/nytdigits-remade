import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime
import uuid

app = Flask(__name__)
cors = CORS(app, origins='*', supports_credentials=True)

# sends puzzles to the front-end upon loading
@app.route("/api/data", methods=['GET'])
def generatePuzzles():
    puzzles = []
    # connects to database in read-only mode so add_puzzle can write data
    conn = sqlite3.connect('file:puzzles.db?mode=ro', uri=True)
    cursor = conn.cursor()
    # creates seed so that every time a person visits within the same hour, they get the same puzzles
    random.seed(int(datetime.today().strftime("%Y%m%H%d")))
    randInt = random.random()
    for n in range(1,6):
        # gets puzzles
        puzzles.append(list(cursor.execute(f"SELECT target, val1, val2, val3, val4, val5, val6 FROM puzzle{n} WHERE id = CAST({randInt*1/n}*(SELECT MAX(id) FROM puzzle{n}) AS INTEGER) LIMIT 1").fetchone()))
    cursor.close()
    conn.close()
    return jsonify({"puzzles": puzzles})

# creates a custom key for browser (unique identifier stored in cookie) if one doesn't exist
@app.route("/api/create_id", methods=['GET'])
def createKey():
    key = str(uuid.uuid4())
    return jsonify({"id": key})

# any time a user submits a puzzle, its statistics get sent here and put into the sql table games.
@app.route('/api/add_puzzle', methods=['POST'])
def addPuzzle():
    # getting all the variables from frontend
    id = request.cookies.get('id')
    puzzleNum = request.json.get('puzzleNum')
    stars = request.json.get('stars')
    numOps = request.json.get('numOps')
    # getting timestamp information
    today = datetime.today()
    date = today.strftime('%Y-%m-%d')
    hour = today.strftime('%H')
    # enter information into database
    conn = sqlite3.connect('puzzles.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO games (id, date, hour, puzzle, stars, ops) VALUES (?, ?, ?, ?, ?, ?)", [id, date, hour, puzzleNum, stars, numOps])
    conn.commit()
    cursor.close()
    conn.close()
    return "Finished."

# gets a user's statistics, sends it back to react
@app.route("/api/get_stats", methods=['GET'])
def getStats():
    # get user id + connect to db
    id = str(request.cookies.get('id'))
    conn = sqlite3.connect('file:puzzles.db?mode=ro', uri=True)
    cursor = conn.cursor()
    # get # unique puzzles played, # of days played, average # of ops, and # of games where n number of stars were attained
    uniquePuzzles = cursor.execute("SELECT COUNT(*) AS uniquePuzzles FROM (SELECT DISTINCT date, hour, puzzle FROM games WHERE id = ?)", (id,)).fetchone()[0]
    numDays = cursor.execute("SELECT COUNT(DISTINCT date) AS uniqueDate FROM games WHERE id = ?", (id,)).fetchone()[0]
    numGames = cursor.execute("SELECT COUNT(*) FROM games WHERE id = ?", (id,)).fetchone()[0]
    averageOps = cursor.execute("SELECT AVG(ops) FROM games WHERE id = ?", (id,)).fetchone()[0]
    nStar = []
    for n in range(1,4):
        nStar.append(cursor.execute("SELECT COUNT(*) FROM games WHERE id = ? AND stars = ?", [id, n]).fetchone()[0])
    cursor.close()
    conn.close()
    return jsonify({
        "uniquePuzzles": uniquePuzzles,
        "numDaysPlayed": numDays,
        "numGames": numGames,
        "averageOps": averageOps,
        "oneStar": nStar[0],
        "twoStar": nStar[1],
        "threeStar": nStar[2],
    })

# ensures flask runs on port 8080
if __name__ == "__main__":
    app.run(debug = True, port = 8080)

