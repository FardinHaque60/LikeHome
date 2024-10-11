# LikeHome
CMPE 165 Team Nexus hotels.com clone. 

## Set-Up
See this [detailed guide](https://docs.google.com/document/d/1slV_IaDIUy8Cx1ohTbfUQ5w1YkLrxQFsPOAyUyFd03s/edit?usp=sharing) on how the app was made from scratch.
Reference below for the simplified instructions:

### Cloning

1.  `git clone git@github.com:FardinHaque60/LikeHome.git` this repo using ssh

### Create a .env for secrets

2. Create a file named `.env` under `LikeHome/` insert api keys here. 

### Configuring the Backend

3.  `cd LikeHome` and create a venv with `python3 -m venv venv`
4.  Activate the venv with `source venv/bin/activate` (deactivate with `deactivate`)
5.  Install the python dependencies with `pip install -r requirements.txt`
6.  `cd backend` then `python manage.py makemigrations likehome_api && python manage.py migrate` to initialize the DB
    * (Note: Run `python manage.py createsuperuser` to create an admin account to access http://localhost:8000/admin, not required for running the app though)

### Configuring the Frontend

7.  Navigate to the frontend directory with `cd frontend` then `npm install` to install the frontend dependencies

### Run the Application

8.  With one terminal in the backend directory run `python manage.py runserver` to start the backend
9.  In another terminal in the frontend directory run `ng serve` to start the frontend
10.  visit http://localhost:4200/ to use the app

### Side Notes

11. Visit 
    * http://localhost:8000/admin for Django admin dashboard to see the database values, add records, etc.
    * http://localhost:8000/[view name] to debug the API endpoint