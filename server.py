import flask
import sqlalchemy as sa
import requests
import json
import os
import pytz
from flask import session
from datetime import datetime

app = flask.Flask(__name__)

# Secret key for use with sessions.
app.secret_key = os.urandom(24)

# These variables are initialized in setup_sqlalchemy to reflect tables in the database.
users = None
event = None

# Used for connecting to and getting data from the database.
engine = None

# Setting the date & time of the start of the event so as to know if the event has started.
CST = pytz.timezone("America/Chicago")
event_start_datetime = datetime(2019, 4, 18, 14, 15).astimezone(CST)

# These are the profile ids that are allowed to set the event bracket.
admin_profile_id = 123
my_profile_id = 321


# All requests go through here before they reach any app.route.
@app.before_request
def before_request():
    session.permanent = True;
    print(datetime.now().astimezone(CST), "Request made", flask.request.method, flask.request.url)
    if flask.request.method == "GET":

        # If the request is associated with a session (the user is logged in), the user is given their main page.
        # Else the user is taken to the login page.
        if "profile_id" in session:
            return main()
        else:
            return login()


# Clears the user's session (logs the user out).
# This is run when the user clicks on the "LOGOUT" button.
@app.route("/clear-session", methods=["POST"])
def clear_session():
    session.pop("profile_id", None)
    print("session is now", session)
    return "Session cleared"


# Returns the login page.
@app.route("/login")
def login():
    return flask.send_from_directory("/home/ubuntu/login_build", "index.html")


# Creates a user from data posted to the server.
@app.route("/create-user", methods=["POST"])
def create_user():
    conn = engine.connect()
    in_data = flask.request.get_json()
    print("Getting user data, in_data is", in_data)
    selected_row = None
    
    # The user's google account belong to d211 to login.
    if ("hd" in in_data and (in_data["hd"] == "students.d211.org" or in_data["hd"] == "d211.org")):
        selected_row = conn.execute("SELECT * FROM users WHERE profile_id=" + str(in_data["profile_id"]) + ";").first()

        # If a user is not found in the database, a new user is constructed.
        if (selected_row == None):
            print("No user data found for", in_data["name"], ", creating a new user...")
            conn.execute(users.insert().values(name=in_data["name"], email=in_data["email"], profile_id=str(in_data["profile_id"]), rank=sa.sql.null(), bracket_male=sa.sql.null(), bracket_female=sa.sql.null()))  
            print("Done creating a new user")

        # A session with the user is started. 
        # Now, when the user reloads the page, they will be taken to their main page.
        session["profile_id"] = in_data["profile_id"]
        session.modified = True;

        print("Done getting user data.")
        conn.close()
        return flask.Response("http://battleforcharity.com/", status=200, mimetype='raw')
    else:
        conn.close()
        print("User tried logging in from outside d211.org")
        return flask.Response("Must login from d211.org", status=403, mimetype='raw')


# Returns the main page.
@app.route("/main")
def main():
    return flask.send_from_directory("/home/ubuntu/build_links", "main.html")


# Gets all user data necessary to render their main page.
@app.route("/get-data", methods=["POST"])
def get_data():
    conn = engine.connect()
    profile_id = int(session["profile_id"])
    print("Getting data for profile_id ", profile_id)

    event_state = conn.execute(sa.select([event])).first()
    user = conn.execute(sa.select([users]).where(users.c.profile_id == str(profile_id))).first()
    conn.close()

    event_has_started = event_start_datetime < datetime.now().astimezone(CST)
    user_brackets = {"male": user["bracket_male"], "female": user["bracket_female"]}
    user_has_posted = {"male": (True if user["bracket_male"] else False), "female": (True if user["bracket_female"] else False)}

    if profile_id == admin_profile_id or profile_id == my_profile_id:
        event_has_started = False
        user_brackets = {"male": event_state["bracket_male"], "female": event_state["bracket_female"]}
        print("User brackets for admin are", user_brackets)
        user_has_posted = {"male": (True if event_state["bracket_male"] else False), "female": (True if event_state["bracket_female"] else False)}
    
    data = json.dumps({"event_has_started": event_has_started,
        "leaderboard": event_state['leaderboard'],
        "user_brackets": user_brackets,
        "correct_brackets": {"male": event_state["bracket_male"], "female": event_state["bracket_female"]},
        "username": user["name"],
        "rank": user["rank"],
        "points": user["points"],
        "name": user["name"],
        "user_has_posted": user_has_posted})

    return data



# Sets the user's male or female bracket in the database.
@app.route("/set-user-bracket", methods=["POST"])
def set_user_bracket(): 
    conn = engine.connect()
    def has_completed():
        event_status = conn.execute(sa.select([event])).first()
        return event_status["bracket_male"] != None and event_status["bracket_female"] != None

    profile_id = int(session["profile_id"])
    json = flask.request.get_json()
    has_started = conn.execute(sa.select([event])).first()['has_started']
    print("Event has_started =", has_started)
    print("Event has_completed =", has_completed())
    print("Received post from profile_id =", profile_id)

    # If the profile_id belongs to the admin or me, the event bracket is set.
    if profile_id == admin_profile_id or profile_id == my_profile_id:

        # The event can only be "completed" using this method once after both event brackets have been set.
        if not has_completed():
            if json["gender"] == "male":
                conn.execute(event.update().values(bracket_male=json["user_bracket"]))
            else:
                conn.execute(event.update().values(bracket_female=json["user_bracket"]))
            print("Set event bracket\n")

            if has_completed():
                create_leaderboard()
        else:
            print("Did not set event bracket\n")
            return "false"
    else:

        # The user's bracket is set if the event has not yet started.
        if not has_started:
            if json["gender"] == "male":
                conn.execute(users.update().where(users.c.profile_id == profile_id).values(bracket_male=json["user_bracket"]))
            else:
                conn.execute(users.update().where(users.c.profile_id == profile_id).values(bracket_female=json["user_bracket"]))

        print("Set user bracket\n")
    conn.close()
    return "true"


# Creates a leaderboard of students from the score of their brackets.
@app.route("/create-leaderboard", methods=["POST"])
def create_leaderboard():
    score_brackets() # This function scores users
    print("Creating leaderboard...")
    conn = engine.connect()

    user_list = conn.execute("SELECT name, profile_id FROM users WHERE points IS NOT NULL ORDER BY points DESC;")
        
    # Giving each user a rank.
    rank = 1
    for u in user_list:
        conn.execute("UPDATE users SET rank=" + str(rank) + " WHERE profile_id=" + str(u[1]) + ";")
        rank += 1
    
    
    # Getting a list of the top ten users.
    res = conn.execute("SELECT name, points FROM users WHERE rank IS NOT NULL AND points IS NOT NULL ORDER BY points DESC LIMIT 10;")
    sql_leaderboard = [dict(r) for r in res]
    leaderboard = []

    for entry in sql_leaderboard:
        leaderboard.append([entry["name"], entry["points"]])

    print("Leaderboard is now", leaderboard)

    conn.execute(event.update().values(leaderboard=leaderboard))
    
    print("Leaderboard generated.")
    conn.close()
    return "Done!"


# Scores the brackets of users in the database.
@app.route("/score-brackets", methods=["POST"])
def score_brackets():
    print("Scoring brackets...")
    conn = engine.connect()

    # Only users who completed both male & female brackets have their brackets scored.
    names = conn.execute(sa.select([users.c.name, users.c.bracket_male, users.c.bracket_female]).where(sa.and_(users.c.bracket_male!=sa.sql.null(), users.c.bracket_female!=sa.sql.null()))).fetchall()
    
    event = conn.execute("SELECT * FROM event").first()
    event_final = [json.loads(event["bracket_male"]), json.loads(event["bracket_female"])]

    # The user's score is calculated.
    for n in names:
        user_guesses = [n[1], n[2]]
       
        user_score = 0
        for i in range(0, 2):
            
            multiplier = 1 if i == 0 else 0.5
            size = 31 if i == 0 else 15
            for x in range(0, size):
                modifier = 0
                
                if(x == size):
                    modifier = 16
                elif(x >= 28 * multiplier):
                    modifier = 8
                elif(x >= 24 *  multiplier):
                    modifier = 4
                elif(x >= 16 * multiplier):
                    modifier = 2
                else:
                    modifier = 1
                
                if ((user_guesses[i])[x] == (event_final[i])[x]):
                    user_score += modifier
            
        conn.execute(users.update().values(points=user_score).where(users.c.name == n[0]))
    
    conn.close()
    return "Done!"


# Create database tools.
def setup_sqlalchemy():
    global engine, users, event
    
    engine = sa.create_engine("mysql+pymysql://sqlalchemy:catblue@localhost/real_server", pool_pre_ping=True)
    metadata = sa.MetaData()

    # Creating database metadata for ease of use later on
    users = sa.Table('users', metadata, sa.Column('name', sa.String), sa.Column('email', sa.String), sa.Column('profile_id', sa.Integer, primary_key=True), sa.Column('rank', sa.Integer), sa.Column('points', sa.Integer), sa.Column('bracket_male', sa.JSON), sa.Column('bracket_female', sa.JSON))

    event = sa.Table('event', metadata, sa.Column('has_started', sa.Boolean), sa.Column('leaderboard', sa.JSON), sa.Column('bracket_male', sa.JSON), sa.Column('bracket_female', sa.JSON))

    metadata.create_all(engine)

setup_sqlalchemy()
