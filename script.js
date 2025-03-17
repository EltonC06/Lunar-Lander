let y_speed = 5.00
let gameRunning = false
let landed = false
let fuel = 100
let gameStatus = "Running"
let level = 1
let score = 0

function startGame() {    
    if (level == 1) {
        let gravityInterval = setInterval(gravity, 150)
        let acelerationInterval = setInterval(aceleration, 40)
        let telemetryInterval = setInterval(updatetelemetry, 150)
        gameRunning = true
        hideMenu(true)
        generateTerrain()
        generateLandingZone()
    }
}

function hideMenu(boolean) {
    let menu = document.getElementById("menu")

    if (boolean == true)  {
        menu.style.display = "none"
    } else {
        menu.style.display = "flex"
    }
}



function resetGame() {
    console.log("Resetando")
    let character = document.getElementById("character")
    character.style.left = "40px"    
    character.style.top = "40px"
    fuel = 100
    y_speed = 0
    level = 1
    gameStatus = "Paused"
    resetTerrainGenerated()
    gameRunning = false
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
            if (checkCollision() == false && isFueled() == true && gameRunning == true) { // jogador não pode se mover uma vez tocado no chão
                character.style.left = int_position_x - move_speed + "px"
                fuel -= 2
            }
            break
        case "right":
            if (checkCollision() == false && isFueled() == true && gameRunning == true) { // jogador não pode se mover uma vez tocado no chão
                character.style.left = int_position_x + move_speed + "px"
                fuel -= 2
            }
            break
        case "up":
            if (checkCollision() == false && isFueled() == true && gameRunning == true) {
                y_speed -= 1
                fuel -= 2
                character.style.backgroundImage = "url('assets/lander_engine_on.png')"
                let timesRun = 0
                var image_interval = setInterval(function() {
                    character.style.backgroundImage = "url('assets/lander_engine_on.png')"
                    timesRun += 1
                    if (timesRun == 9) {
                        character.style.backgroundImage = "url('assets/lander_engine_off.png')"
                        clearInterval(image_interval)
                    }
                }, 100)
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
            verifyGameOver(y_speed, checkLandingSpot())
            y_speed = 0
        }
    }
}

function verifyGameOver(totalSpeed, landingZone) {
    if (totalSpeed > 1.5) {
        // perdeu
        gameStatus = "lose"
        showGameOverMessage(true)
        setTimeout(() => {
            hideMenu(false)
            showGameOverMessage(false)
            location.reload()
        }, 2500);
    } else if (landingZone == "true" && totalSpeed < 1.5) {
        gameStatus = "win"
        nextLevel()
    } else {
        gameStatus = "lose"
        showGameOverMessage(true)
        setTimeout(() => {
            hideMenu(false)
            showGameOverMessage(false)
            location.reload()
        }, 2500);
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
    let textLevel = document.getElementById("level-panel")
    let textScore = document.getElementById("score-panel")
    
    textSpeed.textContent = "Speed: " + y_speed.toFixed(2)
    textFuel.textContent = "Fuel: " + fuel + "%"
    textStatus.textContent = "Status: " + gameStatus
    textLevel.textContent = "Level: " + level
    textScore.textContent = "Score: " + score

}

function checkCollision() {
    let character = document.getElementById("character")
    
    let characterRect = character.getBoundingClientRect() // pega atributos do character
    
    const colecao = document.getElementsByClassName("block")
    for (block of colecao) { 
        let blockRect = block.getBoundingClientRect()
        
        if (characterRect.left < blockRect.right && characterRect.right > blockRect.left) { // verifica o bloco que está em baixo do jogador
            //block.style.backgroundColor = "red"
            if (characterRect.bottom > blockRect.top) { // se o jogador encostou no bloco que está em baixo dele
                return true
            }
        
        } else {
            //block.style.backgroundColor = "gray"
        }
    }
    return false

}

function generateTerrain() {
    console.log("Gerando terreno")
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
        
        // criando atributo
        bloco.setAttribute('landing-zone','false')
        
        terrain.appendChild(bloco)
    }
}

function generateLandingZone() {
    console.log("Gerando zona de pouso")
    let terrain = document.getElementById("terrain")

    let blockCollection = document.getElementsByClassName("block")
    
    let zoneQuantity = 7 - level
    if (zoneQuantity < 1) {
        zoneQuantity = 1
    }

    let zoneGenerated = 0
    
    for (block of blockCollection) {
        if (zoneGenerated < zoneQuantity) {
            if (Math.floor(Math.random() * 10) < 5) { // 50% de chance de gerar uma zona de pouso
                block.style.backgroundColor = "white"
                zoneGenerated += 1
                block.setAttribute('landing-zone', 'true')
            }
        }
    }
    if (zoneGenerated < zoneQuantity) { // certificando que terá zonas geradas
        if (zoneGenerated < zoneQuantity) {
            if (Math.floor(Math.random() * 10) < 5) { // 50% de chance de gerar uma zona de pouso
                block.style.backgroundColor = "white"
                zoneGenerated += 1
                block.setAttribute('landing-zone', 'true')
            }
        }
    }
    
    let intervalCount = 0
    let hideLandingZone = setInterval(function() { // após 1 segundo esconde as zonas de pouso
        if (intervalCount < 5) {
            intervalCount += 1
        } else {
            clearInterval(hideLandingZone)
            for (block of blockCollection) {
                block.style.backgroundColor = "gray"
            }
        }
    }, (200));
}

function resetLandingZone() {
    console.log("Resetando zonas de pouso")
    let blockCollection = document.getElementsByClassName("block")
    for (block of blockCollection) {
        console.log("Resetando zona")
        block.setAttribute('landing-zone', 'false')

    }
}

function resetTerrainGenerated() {
    console.log("Resetando terrenos gerados")
    let terrain = document.getElementById("terrain")
    terrain.innerText = ""

}

function checkLandingSpot() { // so vai checar apenas se tiver pousado com segurança
    let character = document.getElementById("character")
    let blockCollection = document.getElementsByClassName("block")
    let characterRect = character.getBoundingClientRect()

    for (block of blockCollection) {
        blockRect = block.getBoundingClientRect()
        
        
        if (characterRect.left < blockRect.right && characterRect.right > blockRect.left) { // bloco que ele está em cima
            if (block.getAttribute("landing-zone") == "true") {
                return "true"
            } else {
                return "false"
            }
            
        }
    }
}

function nextLevel() {
    let character = document.getElementById("character")
    level += 1
    score += 100 + fuel
    setTimeout(function() {
        resetLandingZone()
        character.style.top = "40px"
        character.style.left = "40px"
        y_speed = 5
        fuel = 100
        gameRunning = true
        gameStatus = "Running"
        generateLandingZone()
    }, 1000)


}

function showGameOverMessage(boolean) {
    let gameOverMenu = document.getElementById("game-over-menu")
    if (boolean == true) {
        gameOverMenu.style.display = "flex"
    } else {
        gameOverMenu.style.display = "none"
    }
}

function showHowToPlay(boolean) {
    let howToPlay = document.getElementById("container-how-to-play")
    let menu = document.getElementById("menu")
    if (boolean == true) {
        menu.style.display = "none"
        howToPlay.style.display = "flex"
    } else {
        howToPlay.style.display = "none"
        menu.style.display = "flex"
    }
}
