from typing import Union
from fastapi import FastAPI
import s2t

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/s2t")
def read_content():
    return s2t.json_dict


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
