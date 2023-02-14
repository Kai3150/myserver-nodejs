import os
import json

with open(os.path.abspath('output.json'), 'r', encoding='utf-8') as f:
    json_dict = json.load(f)
    json_str = json.dumps(json_dict, ensure_ascii=False)
    print(json_str)
