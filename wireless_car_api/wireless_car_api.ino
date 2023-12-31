#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#define SOUND_SPEED 0.034
#define MAX_FORWARD_DISTANCE 25

byte trigger = 12;
byte echo = 13;

byte ENA_pin = 14;
byte IN1 = 27;
byte IN2 = 26;
byte ENB_pin = 32;
byte IN3 = 25;
byte IN4 = 33;

const byte pwm_channel = 0;
const byte frequency = 30000;
const byte resolution = 8;

const char* apiEndpoint = "https://wireless-car-controls.vercel.app/api/data";

enum STATES {
  STOP,
  FORWARD,
  BACKWARD,
  RIGHT,
  LEFT
};

void setup() {
  Serial.begin(115200);
  pinMode(ENA_pin, OUTPUT);
  pinMode(ENB_pin, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(echo, INPUT);
  pinMode(trigger, OUTPUT);

  ledcSetup(pwm_channel, frequency, resolution);
  ledcAttachPin(ENA_pin, pwm_channel);
  ledcAttachPin(ENB_pin, pwm_channel);

  ledcWrite(pwm_channel, 80);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);

  WiFiManager wm;
  // wm.resetSettings();

  bool res = wm.autoConnect("ESPCar", "esp123123");

  if (!res) {
    Serial.println("Failed to connect");
  } else {
    Serial.println("Connected");
  }
}

void move(int direction, int speed) {
  ledcWrite(pwm_channel, speed);

  if (direction == STOP) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN4, LOW);
  } else if (direction == FORWARD) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN4, LOW);
  } else if (direction == BACKWARD) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN4, HIGH);
  } else if (direction == RIGHT) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN3, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN4, HIGH);
  } else if (direction == LEFT) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN4, LOW);
  } else {
    Serial.println("Nope: " + direction);
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    int distance = getFrontDistance();
    String json = httpGETRequest(apiEndpoint);

    DynamicJsonDocument doc(100);
    DeserializationError error = deserializeJson(doc, json);

    if (error) return;
    byte speed = doc["speed"];
    byte movement = doc["movement"];

    if (distance <= MAX_FORWARD_DISTANCE && movement == FORWARD) {
      move(STOP, speed);
    } else {
      move(movement, speed);
    }
  } else {
    Serial.println("WiFi Disconnected");
  }

  delay(200);
}

String httpGETRequest(const char* endpoint) {
  WiFiClient client;
  HTTPClient http;

  http.begin(client, endpoint);

  int httpResponseCode = http.GET();

  String payload = "{}";

  if (httpResponseCode > 0) {
    payload = http.getString();
  }

  http.end();
  return payload;
}

int getFrontDistance() {
  digitalWrite(trigger, LOW);
  delayMicroseconds(2);
  digitalWrite(trigger, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigger, LOW);

  int pulse = pulseIn(echo, HIGH);

  int distance = pulse * SOUND_SPEED / 2;
  Serial.println("Distance " + String(distance));
  return distance;
}
