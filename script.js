let y_speed = 5.00
let gameRunning = false
let landed = false
let gameStatus = "Running"
let fuel = 100

generateTerrain()

function startGame() {    
    if (!gameRunning || landed) {
        let gravityInterval = setInterval(gravity, 150) // vai ficar rodando, mas dentro de cada função, antes de começar o codigo, botei pra checar (gameRunning)
        let acelerationInterval = setInterval(aceleration, 40)
        let telemetryInterval = setInterval(updatetelemetry, 150)
        gameRunning = true
        let statusMessage = document.getElementById("message-div")
        statusMessage.textContent = "Status: Rodando"
    } else {
        console.log("Vou resetar")
        resetGame()
    }
}

function resetGame() {
    console.log("Resetando")
    let character = document.getElementById("character")
    character.style.left = "50px"    
    character.style.top = "50px"
    gameRunning = true
}

document.addEventListener('keydown', event => {    
    if (event.code == "ArrowRight") {
        control("right")
    } else if (event.code == "ArrowLeft") {
        control("left")
    } else if (event.code == "ArrowUp") {
        control("up")
    } else if (event.code == "KeyP") {
        startGame()
    }
})

function control(direction) {
    let character = document.getElementById("character")
    // Pegando os valores posicionais X e Y (horizontal e vertical) do jogador
    let position_x = getComputedStyle(character).left
    let position_y = getComputedStyle(character).top
    
    // Transformando os valores strings recebidos em Inteiros para operações matematicas
    let int_position_x = parseInt(position_x.replace("px", ""))
    let int_position_y = parseInt(position_y.replace("px", ""))
    
    // adicionando valor à posição atual do jogador para se mover
    let move_speed = 20
    switch (direction) {
        case "left":
            if (checkCollision() == false && isFueled() == true) { // jogador não pode se mover uma vez tocado no chão
                character.style.left = int_position_x - move_speed + "px"
                fuel -= 2
            }
            break
        case "right":
            if (checkCollision() == false && isFueled() == true) { // jogador não pode se mover uma vez tocado no chão
                character.style.left = int_position_x + move_speed + "px"
                fuel -= 2
            }
            break
        case "up":
            if (checkCollision() == false && isFueled() == true) {
                y_speed -= 1
                fuel -= 2
            }
            break
    }
}

function isFueled() {
    if (fuel > 0) {
        return true
    }
    else {
        return false
    }
}

function gravity() {
    if (gameRunning) {
                // pegando o valor posicional Y do jogador para ir diminuindo e dar sensação de gravidade
        let character = document.getElementById("character")
        
        let position_y = getComputedStyle(character).top
        let int_position_y = parseInt(position_y.replace("px", ""))
        //console.log("altitude: " + int_position_y)
        
        // se ele estiver caindo
        if (checkCollision() == false) {
            if (y_speed > 0) {
                character.style.top = int_position_y + y_speed + "px"
            }
            else { // se ele estiver subindo eu vou fazer um jeito dele perder a potencia e cair novamente
                y_speed += 0.25
                character.style.top = int_position_y + y_speed + "px"
            }
        } else {
            // velocidade igual a 0 se encostar no chão
            gameRunning = false
            landed = true
            gameOver(y_speed)
            y_speed = 0
        }
    }

}

function gameOver(totalSpeed) {
    let statusMessage = document.getElementById("message-div")
    if (totalSpeed > 1.5) {
        // perdeu
        gameStatus = "lose"
        console.log(gameStatus)
        statusMessage.textContent = "Status: Você perdeu"
    } else {
        // ganhou
        gameStatus = "win"
        statusMessage.textContent = "Status: Você ganhou"
    }
}


// depois que o jogador sobe e começa a descer denovo, a sua velocidade acelera como se fosse na vida real
function aceleration() {  
    if (gameRunning) {
        let character = document.getElementById("character")
        let position_y = getComputedStyle(character).top
        let int_position_y = parseInt(position_y.replace("px", "")) 
        
        if (y_speed < 10 && !checkCollision()) {
            y_speed += 0.05
        }
    }
}

function updatetelemetry() {
    let textSpeed = document.getElementById("speed-panel")
    let textFuel = document.getElementById("fuel-panel")
    let textStatus = document.getElementById("status-panel")
    
    textSpeed.textContent = "Speed: " + y_speed.toFixed(2)
    textFuel.textContent = "Fuel: " + fuel + "%"
    textStatus.textContent = "Status: " + gameStatus

}

function checkCollision() {
    let character = document.getElementById("character")
    
    let characterRect = character.getBoundingClientRect() // pega atributos do character
    
    const colecao = document.getElementsByClassName("block")
    for (block of colecao) { 
        let blockRect = block.getBoundingClientRect()
        
        if (characterRect.left < blockRect.right && characterRect.right > blockRect.left) { // verifica o bloco que está em baixo do jogador
            block.style.backgroundColor = "green"
            if (characterRect.bottom > blockRect.top) { // se o jogador encostou no bloco que está em baixo dele
                return true
            }
        
        } else {
            block.style.backgroundColor = "gray"
        }
    }
    return false

}

function generateTerrain() {
    let terrain = document.getElementById("terrain")
    // terreno será gerado de bloquinho em bloquinho
    
    for (let i = 0; i<15; i++) { // serão gerados 25 blocos distribuidos igualmente em cima do terreno
        let bloco = document.createElement('div')
        bloco.classList.add("block") // evitando Ids repetidos
        bloco.style.width = '40px'
        bloco.style.height = (20 + Math.random()*10) +'px'
        bloco.style.backgroundColor = "gray"
        
        bloco.style.position = "absolute" // gerando em cima do terreno atual
        
        bloco.style.left = i*40 + "px" // espaçamento entre blocos
        // gerar bloco acima de terreno
        bloco.style.bottom = 50 + "px"
        
        terrain.appendChild(bloco)
    }
}