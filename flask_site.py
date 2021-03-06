from string import digits, punctuation
from flask import Flask, render_template, request, flash, session, redirect, url_for, jsonify, Blueprint
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from pymongo import MongoClient
import pymongo
import praw
import datetime

import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
nltk.download('stopwords')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Unga Bunga Secret Key'


# User authentication ------------------------------------------------------------------------------------------------#
login_manager = LoginManager()
login_manager.login_view = '/login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(email):
    return App_user.get_user_by_Id(email)


# Praw functions ------------------------------------------------------------------------------------------------#
file = open('SuperSecretCredentials.txt', 'r')

client_id = file.readline().strip()
client_secret = file.readline().strip()
user_agent = file.readline().strip()

reddit = praw.Reddit(
    client_id=client_id,
    client_secret=client_secret,
    user_agent=user_agent
)


# MongoDB ------------------------------------------------------------------------------------------------#
mongo = MongoClient(file.readline().strip())
db = mongo.db01
collection = db['user_info']

class User(UserMixin):
    def __init__(self, email, record):
        self._email = email
        self._record = record
    
    def get_email(self):
        return self._email
    
    def get_id(self):
        return self._email

    def get_record(self):
        return self._record

class App_user():
    def __init__(self, email, password):
        collection.insert_one({
            'email': email, 
            'password': password
            })

    def get_user_by_Id(email):
        if collection.count_documents({'email':email})== 1:
            return User(email=email, record=collection.find_one({'email':email}))
        else:
            return None


# Route functions ------------------------------------------------------------------------------------------------#
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html', title='Login')
    
    elif request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = App_user.get_user_by_Id(email=email)
        
        if request.form['submit'] == 'log in':
            if not user or not check_password_hash(user._record['password'], password):
                flash('Please verify your login details and try again')
                return redirect(url_for('login'))

            else:
                login_user(user)
                flash(f'Successfully logged in!')
                return redirect(url_for('web_app'))

        elif request.form['submit'] == 'register':
            try:
                session.pop('account_created')
            except Exception:
                pass
            
            if user:
                    flash('This email address is already in use')
                    return redirect(url_for('login'))

            else:
                new_user = App_user(
                email = email,
                password = generate_password_hash(password, method='sha256')
                )

            session['account_created'] = True
            flash('Account successfully created')
            return redirect(url_for('login'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have logged out of the system')
    return redirect(url_for('login'))

@app.route('/app')  
@login_required
def web_app():
    return render_template('app.html')

@app.route('/about')
def about():
    return render_template('about.html', title='About')

@app.route('/scrape_ajax')
def scrape_ajax():
    posts = request.args.get('posts_input')
    words = request.args.get('limit_input')

    if not posts:
        posts = 25
    else:
        posts = int(posts) if int(posts) <= 100 else 100

    if not words:
        words = 15
    else:
        words = int(words) if int(words) <= 30 else 30


    counter = {}
    sorted_keys = []
    sorted_values = []
    word_consolidated = []

    input_sub = request.args.get('subreddit_input')
    hot_posts = reddit.subreddit(input_sub).hot(limit=posts)
    stoplist = set(stopwords.words('english') + list(punctuation) + list(digits))
    
    print(f'\nWord limit: {words}\n')
    print(f'Working on post titles...')
    for index, post in enumerate(hot_posts):
        print(f'{index+1}/{posts}')
        title_tokens = word_tokenize(post.title.lower())
        word_list = [word for word in title_tokens if word not in stoplist and word.isalpha()]
        word_consolidated += word_list

    # Count word occurrence and store in dict
    for word in set(word_consolidated):
        counter[word] = word_consolidated.count(word)

    for word in sorted(counter, key=counter.get):
        sorted_keys.append(word)
        sorted_values.append(counter[word])

    return jsonify({
        'labels': sorted_keys[-words:],
        'data': sorted_values[-words:]
        })

if __name__== '__main__':
    app.run(debug=True)