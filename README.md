# LikeHome
CMPE 165 Team Nexus hotels.com clone. 

## Set-Up
See this [detailed guide](https://docs.google.com/document/d/1slV_IaDIUy8Cx1ohTbfUQ5w1YkLrxQFsPOAyUyFd03s/edit?usp=sharing) on how the app was made from scratch.
Reference below for the simplified instructions:

1.  `git clone git@github.com:FardinHaque60/LikeHome.git` this repo
2.  `cd LikeHome` and create a venv with `python -m venv venv`
3.  Install the python dependencies with `pip install -r requirements.txt`
4.  `cd frontend` then `npm install` to install the frontend dependencies
5.  `cd backend` then `python manage.py makemigrations likehome_api && python manage.py migrate` to initialize the DB
6.  `python manage.py runserver` to start the backend
7.  `cd frontend` and `ng serve` to start the frontend
8.  visit http://localhost:4200/ to use the app

(Note: there may be some shortcomings with this set up, don't spend too much time on it if things break. Feel free to reference the detailed guide to try and debug yourself though.)