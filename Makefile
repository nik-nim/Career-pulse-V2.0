.PHONY: help setup backend frontend docker test clean

help:
	@echo "CareerPulse Commands:"
	@echo "  make setup      Install all dependencies"
	@echo "  make backend    Start backend server"
	@echo "  make frontend   Start frontend dev server"
	@echo "  make docker     Start all services with Docker"
	@echo "  make test       Run all tests"
	@echo "  make clean      Remove cache files"

setup:
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

backend:
	cd backend && uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev

docker:
	docker-compose -f docker-compose.full.yml up -d

test:
	cd backend && pytest tests/ -v

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name node_modules -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete