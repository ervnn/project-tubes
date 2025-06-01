package main

import (
	"fmt"
	"strings"

	"net/http"

	"github.com/gin-gonic/gin"
)

type Komentar struct {
	Teks     string `json:"teks"`
	Sentimen string `json:"sentimen"`
}

type InputKomentar struct {
	Teks string `json:"teks"`
}

type Statistik struct {
	Positif int `json:"positif"`
	Negatif int `json:"negatif"`
	Netral  int `json:"netral"`
}


var komentarList [100]Komentar
var jumlahKomentar int

var kataPositif = [10]string{"bagus", "hebat", "keren", "mantap", "terbaik", "cakep", "gacor", "kacaw", "nyeni", "menarik"}
var kataNegatif = [10]string{"jelek", "buruk", "parah", "bodoh", "gagal", "bacot", "najis", "burik", "gembel", "nora"}

func analisisSentimen(teks string) string {
	teks = strings.ToLower(teks)
	positif, negatif := 0, 0

	for i := 0; i < len(kataPositif); i++ {
		if strings.Contains(teks, kataPositif[i]) {
			positif++
		}
	}

	for i := 0; i < len(kataNegatif); i++ {
		if strings.Contains(teks, kataNegatif[i]) {
			negatif++
		}
	}

	if positif > negatif {
		return "positif"
	} else if negatif > positif {
		return "negatif"
	}
	return "netral"
}

func tambahKomentar(teks string) {
	if jumlahKomentar < 100 {
		komentarList[jumlahKomentar] = Komentar{
			Teks:     teks,
			Sentimen: analisisSentimen(teks),
		}
		jumlahKomentar++
	}
}

func hapusKomentar(index int) {
	if index >= 0 && index < jumlahKomentar {
		for i := index; i < jumlahKomentar-1; i++ {
			komentarList[i] = komentarList[i+1]
		}
		jumlahKomentar--
	}
}

func statistikKomentar() Statistik {
	pos, neg, net := 0, 0, 0
	for i := 0; i < jumlahKomentar; i++ {
		switch komentarList[i].Sentimen {
		case "positif":
			pos++
		case "negatif":
			neg++
		default:
			net++
		}
	}
	return Statistik{
		Positif: pos,
		Negatif: neg,
		Netral:  net,
	}
}

func filterAndSortKomentar(search, sort string) []Komentar {
	var filter [100]Komentar
	count := 0

	if search == "" {
		for i := 0; i < jumlahKomentar; i++ {
			filter[count] = komentarList[i]
			count++
		}
	} else {
		searchLower := strings.ToLower(search)
		for i := 0; i < jumlahKomentar; i++ {
			if strings.Contains(strings.ToLower(komentarList[i].Teks), searchLower) {
				filter[count] = komentarList[i]
				count++
			}
		}
	}

	if sort == "sentimen" {
		ranking := func(s string) int {
			switch s {
			case "positif":
				return 1
			case "netral":
				return 2
			case "negatif":
				return 3
			default:
				return 4
			}
		}

		for i := 0; i < count-1; i++ {
			minIdx := i
			for j := i + 1; j < count; j++ {
				if ranking(filter[j].Sentimen) < ranking(filter[minIdx].Sentimen) {
					minIdx = j
				}
			}
			if minIdx != i {
				filter[i], filter[minIdx] = filter[minIdx], filter[i]
			}
		}

	} else if sort == "panjang" {
		for i := 1; i < count; i++ {
			key := filter[i]
			j := i - 1
			for j >= 0 && len(filter[j].Teks) < len(key.Teks) {
				filter[j+1] = filter[j]
				j--
			}
			filter[j+1] = key
		}
	}

	return filter[:count]
}


func main() {
	r := gin.Default()

	// CORS 
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})

	r.GET("/api/komentar", func(c *gin.Context) {
		komentarAktif := komentarList[:jumlahKomentar]
		c.JSON(http.StatusOK, komentarAktif)
	})


	r.POST("/api/komentar", func(c *gin.Context) {
		var input InputKomentar
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Input tidak valid"})
			return
		}
		tambahKomentar(input.Teks)
		statistik := statistikKomentar()
		c.JSON(http.StatusOK, gin.H{"pesan": "Komentar ditambahkan",
		"statistik": statistik,})
	})

	r.DELETE("/api/komentar/:index", func(c *gin.Context) {
		var index int
		if _, err := fmt.Sscanf(c.Param("index"), "%d", &index);
		err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Index tidak valid"})
			return
		}
		hapusKomentar(index)
		c.JSON(http.StatusOK, gin.H{"pesan": "Komentar dihapus"})
	})

	r.GET("/api/statistik", func(c *gin.Context) {
		c.JSON(http.StatusOK, statistikKomentar())
	})
	
	r.GET("/api/komentar/search", func(c *gin.Context) {
  	  	keyword := c.Query("keyword")  
    	sortOrder := c.Query("sort")    

    	hasil := filterAndSortKomentar(keyword, sortOrder)
    	c.JSON(http.StatusOK, hasil)
	})


	r.Run(":8080")
}
