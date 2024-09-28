# Sentiment and Rating Prediction Service (film review service)

This project is a sentiment and rating prediction service built on the IMDB dataset using DistilBERT. The application is containerized using Docker and is structured into a frontend and backend service.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Stopping the Application](#stopping-the-application)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)

## Features

- Predict sentiment and ratings for movie reviews using DistilBERT.
- Dockerized application for easy deployment and management.
- FastAPI-based RESTful API for backend services.
- User-friendly React frontend interface for interaction.

## Technologies Used

- **Backend**: Python, FastAPI, PyTorch, DistilBERT
- **Frontend**: React
- **Containerization**: Docker
- **Data**: IMDB Dataset

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/) for managing multi-container Docker applications.

### Configuration

Before running the application, create a .env file in the root directory of the project and add the following environment variables (or just create an empty .env file):

```env
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0

FRONTEND_PORT=80
SERVER_NAME=http://localhost

REACT_APP_API_URL=${SERVER_NAME}:${BACKEND_PORT}
```
## Running the Application
To start the application using Docker Compose, run the following command in the root directory of your project:
```
docker-compose up --build
```
This command will build the necessary Docker images and start the frontend and backend services.

Stopping the Application
To stop the services, you can run:
```
docker-compose down
```

## Usage
After starting the application, navigate to http://localhost:80 in your web browser.
Use the frontend interface to input movie reviews and receive sentiment and rating predictions.
The backend will process the request using the FastAPI service, leveraging the DistilBERT model to generate predictions.
## License
This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any improvements or bugs you encounter.
