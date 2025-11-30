package pkg

import (
	"fmt"

	"tesla-app/internal/app/config"
	"tesla-app/internal/app/handler"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type Application struct {
	Config  *config.Config
	Router  *gin.Engine
	Handler *handler.Handler
}

func NewApp(c *config.Config, r *gin.Engine, h *handler.Handler) *Application {
	return &Application{
		Config:  c,
		Router:  r,
		Handler: h,
	}
}

// CORS middleware
/*func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}*/

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Разрешенные адреса
		allowedOrigins := []string{
			"https://prokilya.github.io", // GitHub Pages
			"https://localhost:3000",     // Local dev
			"https://192.168.56.1:3000",  // Network dev
			"https://192.168.0.104:3000", // Network dev
			"https://172.19.16.1:3000",   // Network dev
			"https://192.168.207.125:3000",
		}

		// Проверяем, разрешен ли этот origin
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}

		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Max-Age", "300")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

/*func (a *Application) RunApp() {
	logrus.Info("Server start up")

	a.Handler.RegisterHandler(a.Router)

	serverAddress := fmt.Sprintf("%s:%d", a.Config.ServiceHost, a.Config.ServicePort)
	if err := a.Router.Run(serverAddress); err != nil {
		logrus.Fatal(err)
	}
	logrus.Info("Server down")
}
*/

func (a *Application) RunApp() {
	logrus.Info("Server start up")

	// Добавляем CORS middleware
	a.Router.Use(corsMiddleware())

	a.Handler.RegisterHandler(a.Router)

	serverAddress := fmt.Sprintf("%s:%d", a.Config.ServiceHost, a.Config.ServicePort)

	// Запускаем HTTPS сервер
	logrus.Info("Starting HTTPS server...")                                        // logrus.Info("Starting HTTPS server...")
	if err := a.Router.RunTLS(serverAddress, "cert.crt", "cert.key"); err != nil { // if err := a.Router.RunTLS(serverAddress, "cert.crt", "cert.key"); err != nil {
		logrus.Fatal("HTTPS server failed: ", err)
	}
	logrus.Info("Server down")
}
