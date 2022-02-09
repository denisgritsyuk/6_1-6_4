
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import { getDatabase, ref, child, get, push } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";
document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question')
    const formAnswers = document.querySelector('#formAnswers')
    const nextButton =document.querySelector('#next')
    const prevButton =document.querySelector('#prev')
    const sendButton =document.querySelector('#send')
    
    const firebaseConfig = {
        apiKey: "AIzaSyAjLq9d-OZS7AQwVOLRe6DCDqLSqYYFVCU",
    authDomain: "project-1990816573844268184.firebaseapp.com",
    databaseURL: "https://project-1990816573844268184-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "project-1990816573844268184",
    storageBucket: "project-1990816573844268184.appspot.com",
    messagingSenderId: "485511423723",
    appId: "1:485511423723:web:ebb6216d503e296c9980ae",
    measurementId: "G-CHEXCJV5KB"
      };
      initializeApp(firebaseConfig);

      const getData = () => {
        nextButton.classList.add('d-none')
        prevButton.classList.add('d-none')
        
        formAnswers.textContent = 'LOAD';

        const dbRef = ref(getDatabase());
        get(child(dbRef, `questions`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    playTest(snapshot.val())
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
    }

        setTimeout(() => {
            fetch('./questions.json')
        .then(res =>  res.json())
        .then(obj =>  playTest(obj.questions)) 
        .catch(err => {
            formAnswers.textContent='error data loading'
            console.error(err)
        }) 
        }, 10);
    
   



    


    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block')
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block')
    })


    const playTest = (questions) => {
        const finalAnswers=[];
        let numberQuestion = 0;
        

        const renderAnswers = (index) => {
            questions[index].answers.forEach((answers) =>{
                const answerItem=document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML= `
                
            <input type="${questions[index].type}" id="${answers.title}" name="answer" class="d-none" value="${answers.title}">
            <label for="${answers.title}" class="d-flex flex-column justify-content-between">
              <img class="answerImg" src="${answers.url}" alt="burger">
              <span>${answers.title}</span>
            </label>
            
                `
                formAnswers.appendChild(answerItem);
               
            })
        }

        const renderQuestions = (number) => {
            formAnswers.innerHTML=``;
            switch(true) {
                case (number >= 0 && number <= questions.length - 1):
                    questionTitle.textContent = questions[number].question;
                    renderAnswers(number)
                    nextButton.classList.remove('d-none')
                    prevButton.classList.remove('d-none')
                    sendButton.classList.add('d-none')
                case (number === 0):
                    prevButton.classList.add('d-none')
                    break;
                case (number === questions.length):
                    nextButton.classList.add('d-none')
                    prevButton.classList.add('d-none')
                    sendButton.classList.remove('d-none')
                    questionTitle.textContent = ''
                    formAnswers.innerHTML = `
                        <div>
                            <label for="numberPhone">Enter your number</label>
                            <input type="phone" class="form-control" id="numberPhone">
                        </div>
                    `
                    break;
                case (number === questions.length + 1):
                    formAnswers.textContent = 'Thanks for playing test'
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block')
                    }, 2000)
            }
        
    }
    renderQuestions(numberQuestion);
    const checkAnswer = () => {
        const obj ={};
        const inputs =[...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')
        
        inputs.forEach((input,index) =>{
            if(numberQuestion>=0 && numberQuestion <= questions.length -1){
            obj[`${index}_${questions[numberQuestion].question}`]= input.value;
            }
            if(numberQuestion===questions.length){
                obj['number']= input.value;
            }

        })
        finalAnswers.push(obj)
       
        
    }
    nextButton.onclick =() =>{ 
        checkAnswer();
        numberQuestion++;  
        renderQuestions(numberQuestion)

    }
    prevButton.onclick =() =>{
        numberQuestion--;
        renderQuestions(numberQuestion)

        
    }
    sendButton.onclick =() =>{
        checkAnswer();
        numberQuestion++;
        renderQuestions(numberQuestion)
        console.log(finalAnswers);
        const db = getDatabase();
            push(ref(db, 'contacts'), finalAnswers);

        
    }
   

 
    
}
}) 