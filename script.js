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
            character.style.left = int_position_x - speed + "px"
            break
        case "right":
            character.style.left = int_position_x + speed + "px"
            break
        case "up":
            character.style.top = int_position_y - speed + "px"
            break
    }
}

setInterval(gravity, 250)


function gravity() {
    // pegando o valor posicional Y do jogador para ir diminuindo e dar sensação de gravidade
    let character = document.getElementById("character")

    let position_y = getComputedStyle(character).top
    let int_position_y = parseInt(position_y.replace("px", ""))
    console.log(int_position_y)

    let gravity = 10

    if (int_position_y < 489) {
        character.style.top = int_position_y + gravity + "px"
    }


}