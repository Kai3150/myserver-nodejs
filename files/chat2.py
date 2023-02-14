import pickle
import openai
f = open("C:\\Users\\hiroto kato\\OneDrive - 同志社大学\\ドキュメント\\３年次演習\\nodejs_tutorial\\files\\response.pickle", "rb")
response = pickle.load(f)
print(response)