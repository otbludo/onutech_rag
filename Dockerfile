FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# rend le script de démarrage exécutable
RUN chmod +x start.sh

# Pour que Python trouve le module 'src' correctement
ENV PYTHONPATH=/app

EXPOSE 7860

CMD ["./start.sh"]