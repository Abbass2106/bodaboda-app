from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# In-memory "database" (simple lists, good enough for a student project)
trips = []
trip_counter = 1


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "BodaConnect API is running"})


@app.route("/api/request-ride", methods=["POST"])
def request_ride():
    global trip_counter
    data = request.get_json()

    pickup = data.get("pickup")
    destination = data.get("destination")
    customer_name = data.get("customer_name", "Anonymous")

    if not pickup or not destination:
        return jsonify({"error": "Pickup and destination are required"}), 400

    trip = {
        "id": trip_counter,
        "customer_name": customer_name,
        "pickup": pickup,
        "destination": destination,
        "status": "pending",
        "rider": None,
        "fare": None,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    trips.append(trip)
    trip_counter += 1

    return jsonify({"message": "Ride requested successfully", "trip": trip}), 201


@app.route("/api/trips", methods=["GET"])
def get_trips():
    status = request.args.get("status")
    if status:
        filtered = [t for t in trips if t["status"] == status]
        return jsonify(filtered)
    return jsonify(trips)


@app.route("/api/trips/<int:trip_id>/assign", methods=["POST"])
def assign_trip(trip_id):
    data = request.get_json()
    rider_name = data.get("rider_name")

    for t in trips:
        if t["id"] == trip_id:
            t["rider"] = rider_name
            t["status"] = "assigned"
            return jsonify({"message": "Trip assigned", "trip": t})

    return jsonify({"error": "Trip not found"}), 404


@app.route("/api/trips/<int:trip_id>/complete", methods=["POST"])
def complete_trip(trip_id):
    data = request.get_json()
    fare = data.get("fare", 0)

    for t in trips:
        if t["id"] == trip_id:
            t["status"] = "completed"
            t["fare"] = fare
            return jsonify({"message": "Trip completed", "trip": t})

    return jsonify({"error": "Trip not found"}), 404


@app.route("/api/stats", methods=["GET"])
def get_stats():
    total_trips = len(trips)
    completed = [t for t in trips if t["status"] == "completed"]
    pending = [t for t in trips if t["status"] == "pending"]
    total_revenue = sum(t["fare"] or 0 for t in completed)

    rider_performance = {}
    for t in completed:
        rider = t["rider"] or "Unknown"
        rider_performance[rider] = rider_performance.get(rider, 0) + 1

    return jsonify({
        "total_trips": total_trips,
        "completed_trips": len(completed),
        "pending_trips": len(pending),
        "total_revenue": total_revenue,
        "rider_performance": rider_performance,
    })


# Serve the React build (production)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
