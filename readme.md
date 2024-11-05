- to start backend
    - python(3) -m venv ./.venv
    - source ./.venv/bin/activate
    - pip install -r requirements.txt
    - cd backend && python manage.py runserver
- to start frontend
    - cd frontend
    - npm install
    - npm start
- urls
    - frontend: http://localhost:3000
    - backend: http://localhost:8000/api/items
    - for more uls, refer to backend/api/urls.py OR frontend/src/modules/item/item.api.ts
- formatting
    - frontend code has strict formatting
    - install extensions as instructed in .vscode/settings.json is using VS Code
        -  dbaeumer.vscode-eslint
        -  esbenp.prettier-vscode
<!-- 
python manage.py startapp api
python manage.py makemigrations
python manage.py migrate
-->

