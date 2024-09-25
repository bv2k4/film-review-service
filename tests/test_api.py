import pytest
import httpx

API_URL = "http://localhost:8000/predict"

@pytest.mark.asyncio
async def test_predict_valid_review():
    review = "This is an amazing movie, I really enjoyed it! It had great performances and a compelling storyline."
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert "rating" in data
    assert data["sentiment"] in ["Positive", "Negative"]
    assert isinstance(data["confidence"], float)
    assert isinstance(data["rating"], float)

@pytest.mark.asyncio
async def test_predict_too_few_words():
    review = "Bad movie"
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 422
    data = response.json()
    assert "The review must contain at least 10 words" in data["detail"]

@pytest.mark.asyncio
async def test_predict_too_many_words():
    review = " ".join(["Word"] * 300)
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 422
    data = response.json()
    assert "The review must contain no more than 256 words" in data["detail"]

@pytest.mark.asyncio
async def test_predict_empty_review():
    review = ""
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 422
    data = response.json()
    assert "The review cannot be empty" in data["detail"]

@pytest.mark.asyncio
async def test_predict_only_spaces():
    review = "     "
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 422
    data = response.json()
    assert "The review cannot be empty" in data["detail"]

@pytest.mark.asyncio
async def test_predict_no_letters():
    review = "123 456 789 000 !@# $%^ &*( )"
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 422
    data = response.json()
    assert "The review must contain at least one letter" in data["detail"]

@pytest.mark.asyncio
async def test_predict_word_too_long():
    review = "This is a normal sentence with a verylongwordthatexceedsthemaximumlength in it."
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json={"text": review})

    assert response.status_code == 422
    data = response.json()
    assert "Each word in the review must not exceed" in data["detail"]

@pytest.mark.asyncio
async def test_health_check():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/health")

    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "healthy"}