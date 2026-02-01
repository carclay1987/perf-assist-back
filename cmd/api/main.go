package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/rs/cors"

	"github.com/inkuroshev/perf-assist-backend/internal/config"
	"github.com/inkuroshev/perf-assist-backend/internal/server"
)

func main() {
	// загрузка конфигурации
	cfg := config.New()

	// создаём Gin-роутер через внутренний серверный слой
	// передаем конфигурацию в NewRouter
	r := server.NewRouter(cfg)

	// оборачиваем Gin в стандартный http.Server для graceful shutdown
	srv := &http.Server{
		Addr: cfg.ServerPort,
		Handler: cors.New(cors.Options{
			AllowedOrigins:   []string{"http://localhost:5173"},
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
			AllowedHeaders:   []string{"Content-Type"},
			AllowCredentials: false,
		}).Handler(r),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("starting perf-assist-backend on %s", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("server shutdown error: %v", err)
	}

	log.Println("server stopped")
}
