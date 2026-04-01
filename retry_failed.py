import json

with open("run_tracking.json") as f:
    data = json.load(f)

before = len(data["runs"])
data["runs"] = [r for r in data["runs"] if r.get("status") != "FAILED"]
after = len(data["runs"])

with open("run_tracking.json", "w") as f:
    json.dump(data, f, indent=2)

print(f"Removed {before - after} FAILED entries. {after} runs retained.")