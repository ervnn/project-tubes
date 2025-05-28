package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type Comment struct {
	Text string `json:"text"`
}

type Result struct {
	Pesan string `json:"pesan"`
}

var kataNegatif = [5]string{"jelek", "buruk", "gak suka", "parah", "benci"}
var kataPositif = [5]string{"suka", "senang", "hebat", "mantap", "puas"}
var kataMenarik = [5]string{"keren", "menarik", "bagus", "wow", "terbaik"}

func prosedurCariNegatif(teks string, hasil *bool) {
	for i := 0; i < len(kataNegatif); i++ {
		if strings.Contains(teks, kataNegatif[i]) {
			*hasil = true
			return
		}
	}
	*hasil = false
}

func fungsiCariPositif(teks string) bool {
	for i := 0; i < len(kataPositif); i++ {
		if strings.Contains(teks, kataPositif[i]) {
			return true
		}
	}
	return false
}

func fungsiCariMenarik(teks string) bool {
	for i := 0; i < len(kataMenarik); i++ {
		if strings.Contains(teks, kataMenarik[i]) {
			return true
		}
	}
	return false
}

func prosedurTentukanHasil(neg, menarik, pos bool, hasil *string) {
	if neg && menarik {
		*hasil = "Komentar mengandung kata negatif dan juga menarik"
	} else if neg {
		*hasil = "Komentar negatif"
	} else if menarik && pos {
		*hasil = "Komentar positif dan menarik"
	} else if menarik {
		*hasil = "Komentar menarik"
	} else if pos {
		*hasil = "Komentar positif"
	} else {
		*hasil = "Komentar netral"
	}
}

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

	r.POST("/api/analyze", func(c *gin.Context) {
		var komentar Comment
		if err := c.ShouldBindJSON(&komentar); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Komentar tidak valid"})
			return
		}

		teks := strings.ToLower(komentar.Text)

		var isNegatif bool
		prosedurCariNegatif(teks, &isNegatif)

		isPositif := fungsiCariPositif(teks)
		isMenarik := fungsiCariMenarik(teks)

		var pesan string
		prosedurTentukanHasil(isNegatif, isMenarik, isPositif, &pesan)

		c.JSON(http.StatusOK, Result{Pesan: pesan})
	})

	r.Run(":8080")
}
