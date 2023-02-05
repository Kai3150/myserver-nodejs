import sys
import json
 
# data = sys.stdin.readline()
 
with open('C:\\Users\\hiroto kato\\OneDrive - 同志社大学\\ドキュメント\\３年次演習\\nodejs_tutorial\\files\\output.json', 'r', encoding='utf-8') as f:
    json_dict = json.load(f)
    json_str = json.dumps(json_dict, ensure_ascii=True)
    print(json_str)