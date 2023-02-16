import pickle
from s2t import Paragraph

f = open('paragraph3.pickle', 'rb')
paragraph = pickle.load(f)
keywords_list = paragraph.keywords.replace("\n", "").split('、')
#paragraph.text = paragraph.text.replace("\n\n", "")
json_dict = {'keyword': keywords_list, 'text': paragraph.text, 'date': '2023-02-11'}
print(json_dict)
