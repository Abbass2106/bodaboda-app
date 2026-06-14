# ---------- Stage 1: Build the React frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Build the Flask backend ----------
FROM python:3.12-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Copy the React build output into Flask's static folder
COPY --from=frontend-build /app/frontend/dist ./static

ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["python", "app.py"]