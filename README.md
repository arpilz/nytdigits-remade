# The New York Times' Digits Remade
Walkthrough video link [here](https://youtu.be/b08pBLz9LJ0).

The original game formerly could be found [here](https://www.nytimes.com/games/digits) (unfortunately, this now leads to a 404 error). If you view any jsx files, you should turn on text/word wrapping. This project is my recreation of this game, which existed in beta from April 10th through August 8th of 2023.

## How to run this repo
You should use a split terminal to run this project. On the first terminal, type `cd digits-server`. Ensure Python 3 and pip 3 are installed on your computer globally (you can run `python --version` and `pip --version` to check). You can then create a virtual environment. On Mac, the command is `python3 -m venv yourEnvName`. On Windows, it's `python -m venv yourEnvName`. Your env name can be something as simple as "venv" or "myenv." To activate this environment, type `source yourEnvName/bin/activate` on Mac and `yourEnvName\Scripts\activate` on Windows. You should see the name of your env appear in your command-line prompt next to the path. Run `pip install -r requirements.txt` on Windows and `pip3 install -r requirements` on Mac to install the packages needed (should be Flask and Flask_CORS). Then, run `python3 app.py` on Mac or `python app.py` on Windows. You should see a notice that a Flask app is running, and it should specifically be on local port 8080.

Then, go to your second terminal. You will need Node.js and npm in order to install the correct dependencies. If you do not have Node.js or npm, you can follow the guide [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for instructions on installation. If you are unsure as to whether you have previously installed Node or npm, run `Node -v` and `npm -v` in your terminal to check. If it is installed, the commands should return version numbers. Type `cd digits-client`, then run `npm i`. Now you can type `npm run dev` into the terminal, and you should get a notice from Vite with a localhost url. Ctrl + click (Command + click on Mac) on the link. The web app should be up and running!

When shutting down the project, just hit Ctrl + C on Windows or Command + C on Mac in both terminals. The client-side terminal should ask if you'd like to terminate batch job (press y). Finally, to deactivate the virtual environment, run `deactivate` in the terminal running the Flask app.

## How to play the game
On the screen, you should see five tabs, each with a number. Each tab will have a different puzzle. For each puzzle, you will see six numbers in circles and a seventh number above it. The seventh number is your target number. You must use basic arithmetic operators to reach the target number, with the caveat that at no point can you obtain a non-positive number or a non-integer (so no fun fractions with division, sorry!). In order to perform an operation, click your first number, then click an operator, then click the second number. The puzzle is scored by stars, and stars are gained based on proximity to the target number (the exact number is three stars, 1-10 away is two stars, and 11-25 away is one). If you can gain stars for the puzzle, the submit button will appear, and you can press it to gain stars.

You may reset each puzzle using the green reset button located next to the operators. The goal is to obtain all 15 stars for each puzzle cycle. New puzzles will be generated **every hour** (the original game generated it every day). Within the same hour, the puzzles should be the same. A puzzle will be counted in your statistics every time you hit the submit button or every time you gain three stars on a puzzle (at which point the submit button is automatically triggered). After you have submitted all five puzzles, you will be able to copy and paste a results blurb from the game, which looks basically the same as it does in the original game. You can view statistics from all games via the left-most button in the top right corner. This is also different from the original game, which did not have any form of statistics. You can also toggle between dark and light mode in settings. Have fun playing!

## Credits (as they appear in-game)
Many thanks to the friends whose screenshots and copy-pasted results of the game helped me recreate it, and the videos on YouTube (particularly [here](https://www.youtube.com/watch?v=ba0uEd19l20) and [here](https://www.youtube.com/shorts/QSdowoyswhw)) that helped me figure out what the original UI looked like.