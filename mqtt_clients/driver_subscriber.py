"""
Driver Subscriber Simulation
-----------------------------
Simulates a rider/driver app subscribing to:
  - ride/request : new ride requests broadcast by the backend
  - ride/status  : status updates (accepted/completed)

Run with:
    python driver_subscriber.py
"""

import json
import os
import paho.mqtt.client as mqtt

MQTT_BROKER = os.environ.get("MQTT_BROKER_HOST", "localhost")
MQTT_PORT = int(os.environ.get("MQTT_BROKER_PORT", 1883))


def on_connect(client, userdata, flags, rc):
    print(f"[Driver] Connected to broker at {MQTT_BROKER}:{MQTT_PORT} (rc={rc})")
    client.subscribe("ride/request")
    client.subscribe("ride/status")
    print("[Driver] Subscribed to 'ride/request' and 'ride/status'")


def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())

    if msg.topic == "ride/request":
        print(f"\n[NEW RIDE REQUEST] #{payload['trip_id']}")
        print(f"   Customer: {payload['customer_name']}")
        print(f"   Pickup:   {payload['pickup']}")
        print(f"   Drop-off: {payload['destination']}")

    elif msg.topic == "ride/status":
        print(f"\n[RIDE STATUS UPDATE] #{payload['trip_id']} -> {payload['status'].upper()}")
        if payload.get("rider"):
            print(f"   Rider: {payload['rider']}")
        if payload.get("fare") is not None:
            print(f"   Fare: {payload['fare']}")


if __name__ == "__main__":
    client = mqtt.Client(client_id="driver-app-simulator")
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    print("[Driver] Listening for real-time ride events... (Ctrl+C to stop)")
    client.loop_forever()
