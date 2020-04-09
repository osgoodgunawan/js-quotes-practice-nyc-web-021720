

const url= "http://localhost:3000/quotes?_embed=likes"

const quoteList= document.getElementById("quote-list")

document.addEventListener("DOMContentLoaded", function(e){

    fetchQuotes();
    addQuote();
    dltandlikebutton();

})

function fetchQuotes(){
    fetch(url)
    .then(resp=>resp.json())
    .then(quotes =>quotes.forEach(quote =>{
             renderQuotes(quote)
         })
    )

}


function renderQuotes(q){
   
        const list=document.createElement("li")
        list.className='quote-card'
        list.dataset.id=q.id
        list.innerHTML=`
        <blockquote class="blockquote">
        <p class="mb-0">${q.quote}</p>
        <footer class="blockquote-footer">${q.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${q.likenum ? q.likenum :q.likenum=0}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote> 
        `
        quoteList.append(list)
}

function addQuote(){
    const form=document.querySelector("#new-quote-form")

    form.addEventListener('submit', function(e){
        e.preventDefault()

        if(e.target.lastElementChild ){
            
            fetch(url, {
                method: "POST",
                headers: {
                    "content-type":"application/json",
                    "accept" : "application/json"
                },
                body: JSON.stringify({
                    quote: e.target.quote.value,
                    author: e.target.author.value
                })
                
            })
            .then(resp => resp.json())
            .then(q =>{ 
                renderQuotes(q)
            })
        }

    })

}


function dltandlikebutton(){

    quoteList.addEventListener("click",function(e){

        if(e.target.textContent==="Delete"){
            let target=e.target.parentNode.parentNode
            let id= target.dataset.id
            target.remove()
            fetch(`http://localhost:3000/quotes/${id}`,{
                method: "DELETE"
            })
            // .then(e.target.parentNode.parentNode.remove())

        }
        else if(e.target.className==="btn-success"){
            let like=e.target.querySelector("span")
            let likenum=parseInt(like.innerText)
            likenum++
            like.innerText=`${likenum}`
            let id =e.target.parentNode.parentNode.dataset.id
     
            fetch(`http://localhost:3000/quotes/${id}`,{
                method: "PATCH",
                headers: {
                    "content-type":"application/json",
                    "accept" : "application/json"
                },
                body: JSON.stringify({
                     likenum : likenum
                })
             })
             .then(resp => resp.json())
             .then(console.log)
         }
    })
}

