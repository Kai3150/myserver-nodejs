import re
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
# from sumy.summarizers.luhn import LuhnSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
import datetime
import pytz
import os
import openai
from dotenv import load_dotenv
load_dotenv()


class Paragraph:
    def __init__(self, text):
        openai.api_key = os.environ['OPENAI_API_KEY']
        self.model = 'text-davinci-003'
        self.text = text
        self.keywords = ''
        self.keywords_list = []
        self.date = ''
        self.text_clenging()
        self.summarize()
        # self.gpt_sample_keyword()
        self.get_date()
        self.gpt_summerize()
        self.gpt_keyword()

    def gpt_summerize(self):
        print(len(self.text))
        if len(self.text) > 2000:
            print("too long")
            self.text = self.text[:2000]
            self.summarize()
            print(len(self.text))
            
        prompt = "Summarize the sentences below in bullet point format in Japanese." + "\n" + self.text
        response = openai.Completion.create(model=self.model, prompt=prompt, max_tokens=500)
        self.text = response['choices'][0]['text']
        print(response['choices'][0]['text'])

    def gpt_keyword(self):
        print(len(self.text))
        if len(self.text) > 1300:
            print("too long")
            pass
        else:
            prompt = "次の文章から重要なキーワードを３つ抽出してください。" + "\n" + self.text
            response = openai.Completion.create(model=self.model, prompt=prompt, max_tokens=500)
            self.keywords = response['choices'][0]['text']
            self.keywords_list = re.split('[、,]', self.keywords.replace("\n", ""))

            print(response['choices'][0]['text'])

    def get_date(self):
        tz = pytz.timezone('Asia/Tokyo')
        now = datetime.datetime.now(tz)
        today = now.strftime('%Y-%m-%d')    # Format the date as YYYY-MM-DD
        print(f'Today is {today} in Japan.')
        self.date = today

    def gpt_sample_keyword(self):
        self.keywords = 'this、is,sample、keyword'
        self.keywords_list = re.split('[、,]', self.keywords.replace("\n", ""))

    def text_clenging(self):
        self.text = re.sub(' ', '、', self.text)  # 空白削除

        self.text = self.text.replace('です', 'です。').replace('ます', 'ます。').replace('でした', 'でした。').replace('ません', 'ません。').replace('さい', 'さい。')  # ますの後には必ず「。」
        self.text = self.text.replace('っていうこと', 'こと').replace('っていう', 'という').replace('ていう', 'という').replace('かなと', 'かと')  # ますの後には必ず「。」
        self.text = self.text.replace('おだしょー', '')

        self.text = re.sub(r'(えー|えーと|えっと|そうですね|まあ|じゃあ|なんか|ちょっと|あの|ということで|っていうの|んじゃないか|一応|とりあえず)', '', self.text)  # 削除
        self.text = re.sub(r'ま([^\u3040-\u309F])', r'\1', self.text)  # 削除
        self.text = re.sub(r'という([、。])', r'\1', self.text)  # 削除
        self.text = re.sub(r'(.)(.)(.)\1\2\3', r'\1\2\3', self.text)  # 繰り返し文字
        self.text = re.sub(r'([\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])([\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])\1\2', r'\1\2', self.text)

        while re.search(r'([ねえま][、。]|[、。].{0,2}[、。])', self.text):
            self.text = re.sub(r'([ねえま]、)', '、', self.text)  # 誤字 語感　訂正
            self.text = re.sub(r'([ねえま]。)', '。', self.text)  # 誤字　語感　訂正

            self.text = re.sub(r'[、].{0,5}[、。]', '、', self.text)  # 削除
            self.text = re.sub(r'[。].{0,5}[、。]', '。', self.text)  # 削除
            self.text = re.sub(r'^.{0,5}[、。]', '', self.text)  # 削除

    def summarize(self):
        LANGUAGE = "japanese"  # 言語指定
        SENTENCES_COUNT = 20   # 要約文数 => 2000文字以下になる。

        parser = PlaintextParser.from_string(self.text, Tokenizer(LANGUAGE))
        stemmer = Stemmer(LANGUAGE)
        summarizer = Summarizer(stemmer)
        summarizer.stop_words = get_stop_words(LANGUAGE)

        sentences = ""
        for sentence in summarizer(parser.document, SENTENCES_COUNT):
            sentences = sentences + sentence.__str__()

        self.text = sentences


def slice_and_summerize(text, n=6000):
    json_dict_list = []

    split_str = [text[x:x+n] for x in range(0, len(text), n)] #slice text by n
    for p in split_str:    #loop and summerize
        paragraph = Paragraph(p)
        print(paragraph.text)
        print(paragraph.keywords_list)
        json_dict = {'keyword': paragraph.keywords_list, 'text': paragraph.text, 'date': paragraph.date}
        json_dict_list.append(json_dict)

    return json_dict_list
