from typing import Union
from fastapi import FastAPI, File, UploadFile
import whisper
import pickle
app = FastAPI()
import tempfile
import shutil
from s2t import Paragraph, slice_and_summerize

model = whisper.load_model("large")
print('load complete')

@app.post("/upload_audio")
async def upload_audio_file(audio_file: UploadFile = File(...)):
    # Check if the file is an audio file
    if not audio_file.content_type.startswith('audio/'):
        return {"error": "The file is not an audio file"}

    with tempfile.NamedTemporaryFile(delete=True, dir=".") as temp_file:
        shutil.copyfileobj(audio_file.file, temp_file)

        # with内であればtemp_file.nameでファイル名指定が可能
        print(temp_file.name)
        result = model.transcribe(temp_file.name)

        json_dict_list = slice_and_summerize(result["text"])
        return json_dict_list

    #return {"message": "Audio file uploaded and processed"}


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/parse")
def read_content():
    f = open('paragraph3.pickle', 'rb')
    paragraph = pickle.load(f)
    json_dict = {'keyword': paragraph.keywords_list, 'text': paragraph.text, 'date': paragraph.date}
    print(json_dict)

    return json_dict

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
