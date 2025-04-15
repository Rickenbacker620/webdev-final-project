# Frontend

``` bash
cd frontend
npm install
npm run dev
```

# Backend

Make sure uv is installed

For macOS and Linux:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

For Windows:
```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Then run

``` bash
cd backend
uv sync
uv run fastapi dev app/main.py
```

# Database

A mock database is created using SQLite.

Default user name is `regular_user` and password is `password123`.