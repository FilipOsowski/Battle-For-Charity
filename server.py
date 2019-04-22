import flask
import sqlalchemy as sa
import requests
import json
import os
import pytz
from flask import session
from datetime import datetime

app = flask.Flask(__name__)
app.secret_key = os.urandom(24)
users = None
event = None
engine = None
CST = pytz.timezone("America/Chicago")
event_start_datetime = datetime(2019, 4, 18, 14, 15).astimezone(CST)
main_template = None
admin_profile_id = 123
my_profile_id = 321

@app.route("/clear-session", methods=["POST"])
def clear_session():
    session.pop("profile_id", None)
    print("session is now", session)
    return "Session cleared"

@app.before_request
def before_request():
    session.permanent = True;
    print(datetime.now().astimezone(CST), "Request made", flask.request.method, flask.request.url)
    if flask.request.method == "GET":
        if "profile_id" in session:
            return main()
        else:
            return login()


@app.route("/login")
def login():
    return flask.send_from_directory("/home/ubuntu/login_build", "index.html")


@app.route("/create-user", methods=["POST"])
def create_user():
    conn = engine.connect()
    in_data = flask.request.get_json()
    print("Getting user data, in_data is", in_data)
    selected_row = None
    
    if ("hd" in in_data and (in_data["hd"] == "students.d211.org" or in_data["hd"] == "d211.org")):
        selected_row = conn.execute("SELECT * FROM users WHERE profile_id=" + str(in_data["profile_id"]) + ";").first()
        if (selected_row == None):
            print("No user data found for", in_data["name"], ", creating a new user...")
            conn.execute(users.insert().values(name=in_data["name"], email=in_data["email"], profile_id=str(in_data["profile_id"]), rank=sa.sql.null(), bracket_male=sa.sql.null(), bracket_female=sa.sql.null()))  
            print("Done creating a new user")

        session["profile_id"] = in_data["profile_id"]
        session.modified = True;

        print("Done getting user data.")
        conn.close()
        return flask.Response("http://battleforcharity.com/", status=200, mimetype='raw')
    else:
        conn.close()
        print("User tried logging in from outside d211.org")
        return flask.Response("Must login from d211.org", status=403, mimetype='raw')


@app.route("/main")
def main():
    return flask.send_from_directory("/home/ubuntu/build_links", "main.html")

@app.route("/get-data", methods=["POST"])
def get_data():
    conn = engine.connect()
    profile_id = int(session["profile_id"])
    print("Getting data for profile_id ", profile_id)

    event_state = conn.execute(sa.select([event])).first()
    user = conn.execute(sa.select([users]).where(users.c.profile_id == str(profile_id))).first()
    conn.close()

    event_has_started = event_start_datetime < datetime.now().astimezone(CST)
    # event_has_started = True
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



@app.route("/set-user-bracket", methods=["POST"])
def set_user_bracket(): 
    conn = engine.connect()
    def has_completed():
        event_status = conn.execute(sa.select([event])).first()
        return event_status["bracket_male"] != None and event_status["bracket_female"] != None

    profile_id = int(session["profile_id"])
    json = flask.request.get_json()
    has_started = conn.execute(sa.select([event])).first()['has_started']
    print("Event has_start =", has_started)
    print("Event has_completed =", has_completed())

    print("Received post from profile_id =", profile_id)
    if profile_id == admin_profile_id or profile_id == my_profile_id:
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
        if not has_started:
            if json["gender"] == "male":
                conn.execute(users.update().where(users.c.profile_id == profile_id).values(bracket_male=json["user_bracket"]))
            else:
                conn.execute(users.update().where(users.c.profile_id == profile_id).values(bracket_female=json["user_bracket"]))

        print("Set user bracket\n")
    conn.close()
    return "true"


@app.route("/create-leaderboard", methods=["POST"])
def create_leaderboard():
    score_brackets() # This function scores users
    print("Creating leaderboard...")
    conn = engine.connect()

    user_list = conn.execute("SELECT name, profile_id FROM users WHERE points IS NOT NULL ORDER BY points DESC;")
        
    rank = 1
    for u in user_list:
        conn.execute("UPDATE users SET rank=" + str(rank) + " WHERE profile_id=" + str(u[1]) + ";")
        rank += 1
    
    #...
    
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


@app.route("/score-brackets", methods=["POST"])
def score_brackets():
    print("Scoring brackets...")
    conn = engine.connect()
    # Index of brackets --> bracket_male = n(1) | bracket(female = n(2)
    names = conn.execute(sa.select([users.c.name, users.c.bracket_male, users.c.bracket_female]).where(sa.and_(users.c.bracket_male!=sa.sql.null(), users.c.bracket_female!=sa.sql.null()))).fetchall()
    print("GOT NAMES, NAMES ARE", names);
    
    event = conn.execute("SELECT * FROM event").first()
    event_final = [json.loads(event["bracket_male"]), json.loads(event["bracket_female"])]

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
        # conn.execute("UPDATE users SET points=" + str(user_score) + " WHERE name='" + n[0] + "';")
    
    conn.close()
    return "Done!"


def setup_sqlalchemy():
    global engine, users, event

    engine = sa.create_engine("mysql+pymysql://sqlalchemy:catblue@localhost/real_server", pool_pre_ping=True)
    metadata = sa.MetaData()

    users = sa.Table('users', metadata, sa.Column('name', sa.String), sa.Column('email', sa.String), sa.Column('profile_id', sa.Integer, primary_key=True), sa.Column('rank', sa.Integer), sa.Column('points', sa.Integer), sa.Column('bracket_male', sa.JSON), sa.Column('bracket_female', sa.JSON))

    event = sa.Table('event', metadata, sa.Column('has_started', sa.Boolean), sa.Column('leaderboard', sa.JSON), sa.Column('bracket_male', sa.JSON), sa.Column('bracket_female', sa.JSON))

    metadata.create_all(engine)

setup_sqlalchemy()
