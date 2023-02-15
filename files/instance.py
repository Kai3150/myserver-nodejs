from s2t import Paragraph
import pickle

f = open('output0.pkl', 'rb')
result = pickle.load(f)
# print(result['text'])

paragraph = Paragraph(result['text'])

with open('paragraph.pickle', 'wb') as f:
    pickle.dump(paragraph, f)
