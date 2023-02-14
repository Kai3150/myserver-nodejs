import os
import openai
import pickle
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.environ['OPENAI_API_KEY'] 

prompt="""
こんにちは
"""

model = 'text-davinci-003'
print(len(prompt))
if len(prompt) > 1300:
    print('too long prompt')
else:
    with open('response.pickle', 'wb') as f:
        response = openai.Completion.create(model=model, prompt=prompt, max_tokens=300)
        print(response['choices'][0]['text'])
        pickle.dump(response, f)

# 議事録を作ってください→箇条書きで要旨がリスト化される
#論理関係を明示して次の議事録を作ってください → 議題とか意見とかでリストかされる。