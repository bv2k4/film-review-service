FROM python:3.11.9

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

WORKDIR /app
COPY . /app

RUN pip install -r requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]