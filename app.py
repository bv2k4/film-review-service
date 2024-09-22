import torch
from torch import nn
from transformers import DistilBertTokenizer, DistilBertModel
from fastapi import FastAPI
from pydantic import BaseModel

class DistilBertMultitaskModel(nn.Module):
    def __init__(self, num_labels=2):
        super(DistilBertMultitaskModel, self).__init__()
        self.distilbert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.dropout = nn.Dropout(0.1)
        self.sentiment_classifier = nn.Linear(self.distilbert.config.hidden_size, num_labels)
        self.rating_regressor = nn.Linear(self.distilbert.config.hidden_size, 1)

    def forward(self, input_ids, attention_mask):
        outputs = self.distilbert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.last_hidden_state[:, 0]
        pooled_output = self.dropout(pooled_output)
        sentiment_logits = self.sentiment_classifier(pooled_output)
        rating = self.rating_regressor(pooled_output)
        return sentiment_logits, rating

app = FastAPI()

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

tokenizer = DistilBertTokenizer.from_pretrained('model/tokenizer')

model = DistilBertMultitaskModel()
model.load_state_dict(torch.load('film_review_distilbert.pth', map_location=device, weights_only=True))
model.to(device)
model.eval()

class ReviewRequest(BaseModel):
    text: str

@app.post("/predict")
def predict(review: ReviewRequest):
    text = review.text
    
    encoding = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=256)
    encoding = {k: v.to(device) for k, v in encoding.items()}
    
    with torch.no_grad():
        sentiment_logits, rating_pred = model(**encoding)
    
    sentiment_probs = torch.softmax(sentiment_logits, dim=1)
    sentiment = "Positive" if sentiment_probs[0][1] > 0.5 else "Negative"
    sentiment_confidence = sentiment_probs[0][1].item() if sentiment == "Positive" else sentiment_probs[0][0].item()
    rating = rating_pred.squeeze().item()
    
    return {
        'sentiment': sentiment,
        'confidence': sentiment_confidence,
        'rating': rating
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)