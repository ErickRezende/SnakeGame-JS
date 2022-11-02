const canvas = document.querySelector(".canvas") // Elemento canvas
const context = canvas.getContext("2d") // Tela do jogo

const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

canvas.width = innerWidth // Define a largura do canvas como a largura da tela inteira
canvas.height = innerHeight // Define a altura do canvas como a altura da tela inteira

class Snake { // Define o objeto da cobra
    constructor() { // Constroi a cobra
        this.snake_body = [[300, 300], [290, 300], [280, 300]] // Cada linha da matriz representa a posiçao de um gomo do corpo da cobra

        this.color = "#fff" // Cor da cobra, branco
        this.direction = RIGHT // Direçao da cobra, inicia como direita
        this.score = 0 // Score da cobra
    }

    die() { // Verifica se a cobra morreu
        if (this.snake_body[0][0] >= canvas.width || this.snake_body[0][1] >= canvas.height || this.snake_body[0][0] < 0 || this.snake_body[0][1] < 0) { // Verifica se a cobra saiu da tela
            return true
        } else {
            for (var i = 1; i < this.snake_body.length; i++) { // Laço que percorre cada gomo do corpo da cobra, excetuando a cabeça
                if (this.snake_body[0][0] == this.snake_body[i][0] && this.snake_body[0][1] == this.snake_body[i][1]) { // Verifica se a cobra colidiu com ela mesma
                    return true
                }
            }
            return false
        }
    }

    eat_apple(apple) { // Verifica se a cobra comeu a maça
        if (apple.position.x == this.snake_body[0][0] && apple.position.y == this.snake_body[0][1]) { // Verifica se a posiçao da cabeça da cobra eh a mesma da maça
            return true
        } else {
            return false
        }
    }

    draw() { // Desenha a cobra na tela
        for (var pos = 0; pos < this.snake_body.length; pos++) { // Laço que percorre cada gomo da cobra
            context.fillStyle = this.color
            context.fillRect(this.snake_body[pos][0], this.snake_body[pos][1], 10, 10) // Desenha a gomo da cobra em sua respectiva posiçao
        }
    }

    update(apple) { // Atualiza os dados necessarios da cobra a cda frame
        addEventListener('keydown', (event) => { // Verifica se uma tecla foi pressionada
            switch (event.keyCode) {
                case 38: // Seta para cima
                    this.direction = UP
                    break

                case 39: // Seta para cima
                    this.direction = RIGHT
                    break

                case 40: // Seta para baixo
                    this.direction = DOWN
                    break

                case 37: // Seta para a esquerda
                    this.direction = LEFT
                    break

                default: // Outra tecla
                    break
            }
        })

        for (var i = this.snake_body.length - 1; i > 0; i--) { // Laço que percorre cada gomo da cobra em ordem decrescente
            this.snake_body[i] = [this.snake_body[i - 1][0], this.snake_body[i - 1][1]] // Faz o gomo receber a posiçao do gomo anterior
        }

        // Faz a cabeça da cobra andar de acordo com a direçao da cobra
        if (this.direction == UP) {
            this.snake_body[0] = [this.snake_body[0][0], this.snake_body[0][1] - 10]
        } else if (this.direction == RIGHT) {
            this.snake_body[0] = [this.snake_body[0][0] + 10, this.snake_body[0][1]]
        } else if (this.direction == DOWN) {
            this.snake_body[0] = [this.snake_body[0][0], this.snake_body[0][1] + 10]
        } else if (this.direction == LEFT) {
            this.snake_body[0] = [this.snake_body[0][0] - 10, this.snake_body[0][1]]
        }

        this.draw()
    }
}

class Apple { // Define o objeto da maça
    constructor() { // Constroi a maça
        this.position = { // Posiçao da maça
            x: 100, // Posiçao horizontal
            y: 100 // Posiçao vertical
        }
        this.color = "#ff0000" // Cor da maça, vermelho
    }

    gen_pos() { // Gera uma nova posiçao aleatoria para a maça
        this.position.x = (Math.floor(Math.random() * (canvas.width / 10 - 1))) * 10 // Gera a posiçao na horizontal 
        this.position.y = (Math.floor(Math.random() * (canvas.height / 10 - 1))) * 10 // Gera a posiçao na vertical
    }

    draw() { // Desenha a maça na tela
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, 10, 10)
    }

    update() { // Atualiza os dados necessarios da cobra a cda frame
        this.draw()
    }
}

const apple = new Apple()
const snake = new Snake()

var play = setInterval(() => { // Laço que se repete a cada frame
    context.clearRect(0, 0, canvas.width, canvas.height) // Limpa a tela do canvas

    if (snake.eat_apple(apple)) { // Verifica se a cobra comeu a maça
        snake.score++ // Aumenta o score da cobra
        snake.snake_body.push([0, 0]) // Faz a cobra crescer

        apple.gen_pos() // Gera uma nova posiçao para a maça
    }

    // Define uma cor de fundo para a tela, preto
    context.fillStyle = "#000"
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (var cont = 0; cont < canvas.height / 10; cont++) { // Desenha as linhas horizontais
        context.fillStyle = "#444"
        context.fillRect(0, cont * 10, canvas.width, 1)
    }

    for (var cont = 0; cont < canvas.width / 10; cont++) { // Desenha as linhas verticais
        context.fillStyle = "#444"
        context.fillRect(cont * 10, 0, 1, canvas.height)
    }

    // Escreve o score da cobra no canto superior direito da tela
    context.font = "18px Arial Bold"
    context.fillStyle = "#fff"
    context.fillText(`Score: ${snake.score}`, canvas.width - 100, 18)

    apple.update() // Atualiza a maça
    snake.update() // Atualiza a cobra

    if (snake.die()) { // Verfica se a cobra morreu

        // Escreve "Game Over" no centro da tela
        context.font = "75px Arial Bold"
        context.fillStyle = "#fff"
        context.fillText("Game Over", canvas.width / 2 - 260, canvas.height / 2 - 35)

        clearInterval(play) // Cancela a repetiçao e termina o codigo
    }
}, 1000 / 10) // 10 fps