package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Cors
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        c.Next()
    })

    r.GET("/api/message", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Halo dari backend Golang!",
        })
    })

    r.Run(":8080")
}
