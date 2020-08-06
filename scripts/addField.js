// procurar o botão
document.querySelector("#add-time")
// quando clicar no botão
.addEventListener('click', cloneField)

// executar uma ação
function cloneField () {
    // duplicar os campos. Que campos?
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true)
    // fará com que haja uma duplicação do campo .schedule-item
   
    // limpar os campos. Que campos?    
    const fields = newFieldContainer.querySelectorAll('input')

    /*
        for(var i=0; i<fields.length; i++){
            fields[i].value = ""
        }
    */
    
    // para cada campo, limpar
    fields.forEach(function(field) {
        // pegar o field do momento e limpar ele
        field.value = ""
    })

    // colocar na página. Em que lugar da página?
    document.querySelector('#schedule-items').appendChild(newFieldContainer)
}