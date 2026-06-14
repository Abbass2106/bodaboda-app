"""
MQTT integration test: publish a message and confirm a subscriber
receives it. Requires a running Mosquitto broker on localhost:1883
(in CI, this is started as a service container).
"""

import json
import os
import time
import paho.mqtt.client as mqtt
import pytest

MQTT_BROKER = os.environ.get("MQTT_BROKER_HOST", "localhost")
MQTT_PORT = int(os.environ.get("MQTT_BROKER_PORT", 1883))


def test_mqtt_publish_and_receive():
    received = []

    def on_message(client, userdata, msg):
        received.append(json.loads(msg.payload.decode()))

    subscriber = mqtt.Client(client_id="test-subscriber")
    subscriber.on_message = on_message

    try:
        subscriber.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    except Exception as e:
        pytest.skip(f"MQTT broker not available: {e}")

    subscriber.subscribe("ride/request")
    subscriber.loop_start()

    time.sleep(0.5)  # let subscription register

    publisher = mqtt.Client(client_id="test-publisher")
    publisher.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    publisher.publish("ride/request", json.dumps({
        "trip_id": 1,
        "customer_name": "Test User",
        "pickup": "A",
        "destination": "B",
        "status": "pending",
    }))
    publisher.disconnect()

    time.sleep(1)  # wait for message to arrive
    subscriber.loop_stop()
    subscriber.disconnect()

    assert len(received) == 1
    assert received[0]["pickup"] == "A"
    assert received[0]["destination"] == "B"
