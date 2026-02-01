APP_NAME=perf-assist-backend

.PHONY: run
run:
	go run ./cmd/api

.PHONY: tidy
tidy:
	go mod tidy

.PHONY: migrate-up
migrate-up:
	migrate -database postgres://perfassist:perfassist@localhost:5432/perfassist?sslmode=disable -path migrations up

.PHONY: migrate-down
migrate-down:
	migrate -database postgres://perfassist:perfassist@localhost:5432/perfassist?sslmode=disable -path migrations down
