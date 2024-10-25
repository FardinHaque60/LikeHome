echo "----------------------------------------------------- Activating virtual environment (venv) -----------------------------------------------------"
source ../venv/bin/activate
echo "----------------------------------------------------- Venv activated -----------------------------------------------------"

echo "----------------------------------------------------- Updating dependencies -----------------------------------------------------"
pip install -r ../requirements.txt
echo "----------------------------------------------------- Dependencies updated -----------------------------------------------------"

echo "----------------------------------------------------- Running migrations -----------------------------------------------------"
python manage.py migrate
echo "----------------------------------------------------- Migrations made-----------------------------------------------------"

echo "------- REMINDER: create .env in LikeHome/ dir from: https://docs.google.com/document/d/14bQnqJJ0wbomVwEROi0IhHXNF5j5Ae0Ipkg3zeCoUkc/edit?usp=drive_link -------"

echo "----------------------------------------------------- Starting server -----------------------------------------------------"
sleep 5 # sleep for 5 seconds to allow user to see reminder
python manage.py runserver