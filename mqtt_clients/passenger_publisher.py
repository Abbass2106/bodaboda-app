"""
Passenger Publisher Simulation
--------------------------------
Simulates a passenger app publishing a new ride request directly
to the MQTT broker (in the real app, the Flask backend does this
automatically when POST /api/request-ride is called).

This script is useful to demo MQTT pub/sub independently of the
web app: run driver_subscriber.py in one terminal, then run this
script in another and watch the message arrive instantly.

Run with:
    python passenger_publisher.py
"""

import json
import os
import time
import paho.mqtt.client as mqtt

MQTT_BROKER = os.environ.get("MQTT_BROKER_HOST", "localhost")
MQTT_PORT = int(os.environ.get("MQTT_BROKER_PORT", 1883))


if __name__ == "__main__":
    client = mqtt.Client(client_id="passenger-app-simulator")
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_start()

    message = {
        "trip_id": 999,
        "customer_name": "Test Passenger",
        "pickup": "Nyerere Square",
        "destination": "Dodoma Stadium",
        "status": "pending",
    }

    print(f"[Passenger] Publishing ride request to 'ride/request': {message}")
    client.publish("ride/request", json.dumps(message))

    time.sleep(1)  # give it a moment to send before disconnecting
    client.loop_stop()
    client.disconnect()
    print("[Passenger] Done.")
