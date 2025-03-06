function control(direction) {
    let character = document.getElementById("character")
    // Pegando os valores posicionais X e Y (horizontal e vertical) do jogador
    let position_x = getComputedStyle(character).left
    let position_y = getComputedStyle(character).top
    
    // Transformando os valores strings recebidos em Inteiros para operações matematicas
    let int_position_x = parseInt(position_x.replace("px", ""))
    let int_position_y = parseInt(position_y.replace("px", ""))
    
    // adicionando valor à posição atual do jogador para se mover
    switch (direction) {
        case "left":
            character.style.left = int_position_x - 10 + "px"
            break
        case "right":
            character.style.left = int_position_x + 10 + "px"
            break
        case "up":
            character.style.top = int_position_y - 10 + "px"
            break
    }
}