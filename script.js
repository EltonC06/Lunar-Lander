let y_speed = 5

function control(direction) {
    let character = document.getElementById("character")
    // Pegando os valores posicionais X e Y (horizontal e vertical) do jogador
    let position_x = getComputedStyle(character).left
    let position_y = getComputedStyle(character).top
    
    // Transformando os valores strings recebidos em Inteiros para operações matematicas
    let int_position_x = parseInt(position_x.replace("px", ""))
    let int_position_y = parseInt(position_y.replace("px", ""))
    
    // adicionando valor à posição atual do jogador para se mover
    let speed = 10
    switch (direction) {
        case "left":
            if (int_position_y != 490) { // jogador não pode se mover uma vez tocado no chão
                character.style.left = int_position_x - speed + "px"
            }
            
            break
        case "right":
            if (int_position_y != 490) { // jogador não pode se mover uma vez tocado no chão
                character.style.left = int_position_x + speed + "px"
            }
            break
        case "up":
            if (int_position_y != 490) {
                character.style.top = int_position_y - speed + "px"
                y_speed -= 1
            }
            break
    }
}

setInterval(gravity, 150)
setInterval(aceleration, 1500)
setInterval(updatetelemetry, 150)


function gravity() {
    // pegando o valor posicional Y do jogador para ir diminuindo e dar sensação de gravidade
    let character = document.getElementById("character")
    
    let position_y = getComputedStyle(character).top
    let int_position_y = parseInt(position_y.replace("px", ""))
    console.log("altitude: " + int_position_y)
    console.log("Velocidade: " + y_speed)

    // se ele estiver caindo
    if (int_position_y < 490) {
        if (y_speed > 0) {
            character.style.top = int_position_y + y_speed + "px"
        }
        else { // se ele estiver subindo eu vou fazer um jeito dele perder a potencia e cair novamente
            y_speed += 1

            character.style.top = int_position_y + y_speed + "px"
        }
    } else {
        // velocidade igual a 0 se encostar no chão
        y_speed = 0
    }
}

// depois que o jogador sobe e começa a descer denovo, a sua velocidade acelera como se fosse na vida real
function aceleration() {  
    let character = document.getElementById("character")
    let position_y = getComputedStyle(character).top
    let int_position_y = parseInt(position_y.replace("px", "")) 

    // não pode acelerar quando tiver muito perto da superficie, pois aí vai ajudar o jogo a ficar mais jogável
    if (y_speed < 5 && int_position_y < 470 ) {
        y_speed += 1
        console.log("acelerando +1")
    }
}

function updatetelemetry() {
    let text = document.getElementById("data")
    text.textContent = "Speed: " + y_speed
}
