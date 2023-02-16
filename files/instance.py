from s2t import Paragraph
import pickle

f = open('output.pkl', 'rb')
result = pickle.load(f)

text0 = result['text'][:6000]
text1 = result['text'][6000:12000]
text2 = result['text'][12000:18000]
text3 = result['text'][18000:]

paragraph = Paragraph(text3)

with open('paragraph3.pickle', 'wb') as f:
    pickle.dump(paragraph, f)
