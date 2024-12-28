# this file converted my puzzle{number}.json files into tables within a sql database
import json
import sqlite3

conn = sqlite3.connect('puzzles.db')
cursor = conn.cursor()

# iterates over puzzles 1-5
for n in range(1, 6):
    with open(f"./puzzlesjson/puzzle{n}.json", "r") as puzzle:
        data = json.load(puzzle)

    # the jsons were originally dicts whose values were lists, each element of which was a list with six elements.
    # this converts each list in list to an element in a list, which makes it easier to insert into a table
    dbrows = [(int(key), value[0], value[1], value[2], value[3], value[4], value[5]) for key, values in data.items() for value in values]

    # creates table for each puzzle, adds all values of dbrows
    cursor.execute(f"CREATE TABLE puzzle{n} (id INTEGER PRIMARY KEY, target INTEGER NOT NULL, val1 INTEGER NOT NULL, val2 INTEGER NOT NULL, val3 INTEGER NOT NULL, val4 INTEGER NOT NULL, val5 INTEGER NOT NULL, val6 INTEGER NOT NULL)")
    cursor.executemany(f"INSERT INTO puzzle{n} (target, val1, val2, val3, val4, val5, val6) VALUES (?, ?, ?, ?, ?, ?, ?)", dbrows)

# creates table for all games played by users, allowing for statistics
cursor.execute(f"CREATE TABLE games (id TEXT NOT NULL, date TEXT NOT NULL, hour INTEGER NOT NULL, puzzle INTEGER NOT NULL, stars INTEGER NOT NULL, ops INTEGER NOT NULL)");

# closes db
conn.commit()
conn.close()