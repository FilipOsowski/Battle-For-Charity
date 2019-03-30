import flask
from flask import session
import sqlalchemy as sa
import requests
import json
import os

app = flask.Flask(__name__)
app.secret_key = os.urandom(24)
conn = None
users = None
event = None
main_template = None
admin_profile_id = 12345

@app.route("/clear-session", methods=["POST"])
def clear_session():
    session.pop("profile_id", None)
    print("session is now", session)
    return "Session cleared"

@app.before_request
def before_request():
    session.permanent = True;
    print("Request made", flask.request.url)
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
    in_data = flask.request.get_json()
    selected_row = None
    
    if ("hd" in in_data):
        if (in_data["hd"] == "students.d211.org"):
            selected_row = conn.execute("SELECT * FROM users WHERE profile_id=" + str(in_data["profile_id"]) + ";").first()
            if (selected_row == None):
                print("No current user " + in_data["name"] + " with profile id " + str(in_data["profile_id"]))
                conn.execute("INSERT INTO users (name, email, profile_id, rank, bracket_male, bracket_female) VALUES ('" + in_data["name"] + "', '" + in_data["email"] + "', '" + str(in_data["profile_id"]) + "', NULL, NULL, NULL);")
                print("User created: " + in_data["name"])
            else:
                print("User found! --> " + selected_row["name"])    

            session["profile_id"] = in_data["profile_id"]
            session.modified = True;

            print("session is NOW", session)
            return flask.Response("http://battleforcharity.com/profile", status=200, mimetype='raw')
    else:
        print("User tried logging in from outside d211.org")
        return flask.Response("Must login from d211.org", status=403, mimetype='raw')


# "
@app.route("/main")
def main():
    return flask.send_from_directory("/home/ubuntu/build_links", "main.html")

@app.route("/get-data", methods=["POST"])
def get_data():
    # return flask.send_from_directory("/home/ubuntu/build_links", "main.html")
    profile_id = session["profile_id"]
    # print("running get data")
    # profile_id = 99999

    event_state = conn.execute(sa.select([event])).first()
    user = conn.execute(sa.select([users]).where(users.c.profile_id == profile_id)).first()

    event_has_started = event_state["has_started"]

    if profile_id == admin_profile_id:
        event_has_started = False
    
    data = json.dumps({"event_has_started": event_has_started,
        "leaderboard": event_state['leaderboard'],
        "user_brackets": {"male": user["bracket_male"], "female": user["bracket_female"]},
        "correct_brackets": {"male": event_state["bracket_male"], "female": event_state["bracket_female"]},
        "username": user["name"],
        "rank": user["rank"],
        "points": user["points"],
        "name": user["name"],
        "user_has_posted": {"male": (True if user["bracket_male"] else False), "female": (True if user["bracket_female"] else False)}})

    return data



@app.route("/set-user-bracket", methods=["POST"])
def set_user_bracket(): 
    def has_completed():
        event_status = conn.execute(sa.select([event])).first()
        return event_status["bracket_male"] != None and event_status["bracket_female"] != None

    profile_id = session["profile_id"]
    json = flask.request.get_json()
    has_started = conn.execute(sa.select([event])).first()['has_started']
    print("Event has_start =", has_started)
    print("Event has_completed =", has_completed())

    if profile_id == admin_profile_id:
        print("Received post from admin, profile_id =", profile_id)
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
        print("Received post from user, profile_id =", profile_id)
        if not has_started:
            if json["gender"] == "male":
                conn.execute(users.update().where(users.c.profile_id == profile_id).values(bracket_male=json["user_bracket"]))
            else:
                conn.execute(users.update().where(users.c.profile_id == profile_id).values(bracket_female=json["user_bracket"]))

        print("Set user bracket\n")
    return "true"


@app.route("/create-leaderboard", methods=["POST"])
def create_leaderboard():
    score_brackets() # This function scores users
    print("creating leaderboard\n.\n.\n.")

    user_list = conn.execute("SELECT name, profile_id FROM users WHERE points IS NOT NULL ORDER BY points DESC;")
        
    rank = 1
    for u in user_list:
        conn.execute("UPDATE users SET rank=" + str(rank) + " WHERE profile_id=" + str(u[1]) + ";")
        print(str(rank) + ": " + u[0] + " --> " + str(u[1]))
        rank += 1
    
    #...
    
    res = conn.execute("SELECT name, points FROM users WHERE rank IS NOT NULL ORDER BY rank ASC LIMIT 10;")
    leaderboard = json.dumps([dict(r) for r in res])
    conn.execute("UPDATE event SET leaderboard='" + leaderboard + "' WHERE leaderboard IS NULL;")
    
    print("Leaderboard generated")
    return "Done!"


@app.route("/score-brackets", methods=["POST"])
def score_brackets():

    # TO-DO:
        # loop a second time to score females [x]
        # sort winners in leaderboard function [x]
        # return json object of top winners [ ]

    # Index of brackets --> bracket_male = n(1) | bracket(female = n(2)
    names = conn.execute("SELECT name, bracket_male, bracket_female FROM users WHERE bracket_male IS NOT NULL AND bracket_female IS NOT NULL;").fetchall()
    # print(names[0]).
    
    event = conn.execute("SELECT * FROM event").first()
    event_final = [json.loads(event["bracket_male"]), json.loads(event["bracket_female"])]

    for n in names:
        user_guesses = [json.loads(n[1]), json.loads(n[2])]
       
        user_score = 0
        for i in range(0, 2):
            # print(i)
            
            for x in range(0, 31):
                modifier = 0
                
                if(x == 30):
                    modifier = 16
                elif(x >= 28):
                    modifier = 8
                elif(x >= 24):
                    modifier = 4
                elif(x >= 16):
                    modifier = 2
                else:
                    modifier = 1
                
                #...
                
                if ((user_guesses[i])[x] == (event_final[i])[x]):
                    # print("Index(" + str(x) + ") -- " + (user_guesses[i])[x] + ", " + (event_final[i])[x] + ": " + str(modifier))
                    user_score += modifier
                # else:
                    # print("Index(" + str(x) + ") -- " + (user_guesses[i])[x] + ", " + (event_final[i])[x] + ": 0")
                
            #...
            
        print(str(n[0] + ": " + str(user_score)))
        conn.execute("UPDATE users SET points=" + str(user_score) + " WHERE name='" + n[0] + "';")
    
    #...   
    
    return "Done!"


@app.route("/get-leaderboard", methods=["POST"])
def get_leaderboard():
    res = conn.execute("SELECT name, points FROM users WHERE points IS NOT NULL ORDER BY points ASC LIMIT 10;")
    leaderboard = json.dumps([dict(r) for r in res])
    print(leaderboard)

    return "Done!"

def setup_sqlalchemy():
    global conn, users, event

    engine = sa.create_engine("mysql+pymysql://sqlalchemy:catblue@localhost/demo_server")
    metadata = sa.MetaData()

    users = sa.Table('users', metadata, sa.Column('name', sa.String), sa.Column('email', sa.String), sa.Column('profile_id', sa.Integer, primary_key=True), sa.Column('rank', sa.Integer), sa.Column('points', sa.Integer), sa.Column('bracket_male', sa.JSON), sa.Column('bracket_female', sa.JSON))

    event = sa.Table('event', metadata, sa.Column('has_started', sa.Boolean), sa.Column('leaderboard', sa.JSON), sa.Column('bracket_male', sa.JSON), sa.Column('bracket_female', sa.JSON))

    metadata.create_all(engine)

    conn = engine.connect()

setup_sqlalchemy()
