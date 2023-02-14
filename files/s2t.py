import re
import pickle

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
# from sumy.summarizers.luhn import LuhnSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

import os
import openai
import pickle
from dotenv import load_dotenv
load_dotenv()


class Paragraph:
    def __init__(self, text):
        self.text = text
        self.keywords = []
        self.text_clenging()
        self.summarize()
        #self.gpt_summerize()

    def gpt_summerize(self):
        openai.api_key = os.environ['OPENAI_API_KEY']
        model = 'text-davinci-003'
        print(len(self.text))
        if len(self.text) > 1300:
            print('too long prompt')
        else:
            with open('response.pickle', 'wb') as f:
                response = openai.Completion.create(model=model, prompt=self.text, max_tokens=500)
                print(response['choices'][0]['text'])
                self.text = response['choices'][0]['text']
                pickle.dump(response, f)

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
        count = len(self.text.split('。'))
        count = round(count/4)#25%のこし

        LANGUAGE = "japanese"  # 言語指定
        SENTENCES_COUNT = 20#count  # 要約文数


        # parser = PlaintextParser.from_file("document.txt", Tokenizer(LANGUAGE))
        parser = PlaintextParser.from_string(self.text, Tokenizer(LANGUAGE))
        stemmer = Stemmer(LANGUAGE)

        summarizer = Summarizer(stemmer)
        summarizer.stop_words = get_stop_words(LANGUAGE)

        sentences = ""
        for sentence in summarizer(parser.document, SENTENCES_COUNT):
            sentences = sentences + sentence.__str__()

        self.text = sentences


f = open('output0.pkl', 'rb')
result = pickle.load(f)
#print(result['text'])

paragraph = Paragraph(result['text'])
print('###################################################################################################')
print(paragraph.text)
print(len(paragraph.text))
print('###################################################################################################')
# paragraph.gpt_summerize()
# print(paragraph.text)
