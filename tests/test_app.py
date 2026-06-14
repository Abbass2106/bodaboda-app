import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import pytest
from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"


def test_request_ride_success(client):
    response = client.post(
        "/api/request-ride",
        json={
            "customer_name": "Asha",
            "pickup": "Nyerere Square",
            "destination": "Dodoma Stadium",
        },
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data["trip"]["status"] == "pending"
    assert data["trip"]["pickup"] == "Nyerere Square"


def test_request_ride_missing_fields(client):
    response = client.post(
        "/api/request-ride",
        json={"customer_name": "Asha"},
    )
    assert response.status_code == 400


def test_get_trips(client):
    response = client.get("/api/trips")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)


def test_get_stats(client):
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.get_json()
    assert "total_trips" in data
    assert "total_revenue" in data
