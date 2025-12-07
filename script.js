let currentTest=1, totalTests=20, currentQuestion=1, totalQuestions=50;
let questions=[], timerInterval, timeLeft=600, startTime, endTime;

function createTestButtons(){
    let container=document.getElementById("testButtons");
    for(let i=1;i<=20;i++){
        let btn=document.createElement("button");
        btn.id="testBtn"+i; btn.className="test-btn";
        btn.innerText="Test "+i; btn.onclick=()=>startTest(i);
        container.appendChild(btn);
    }
}
createTestButtons();

// EASY QUESTIONS: numbers 1-30, mostly + and -
function generateExpression(){
    let parts=[]; let count=Math.random()>0.7?4:3;
    for(let i=0;i<count;i++) parts.push(Math.floor(Math.random()*30)+1);
    let expr=""+parts[0];
    for(let i=1;i<parts.length;i++) expr+=(Math.random()>0.5?"+":"-")+parts[i];
    return expr;
}
function generateOptions(correct){
    let options=[correct];
    while(options.length<4){
        let wrong=correct+Math.floor(Math.random()*11)-5;
        if(!options.includes(wrong)) options.push(wrong);
    }
    return options.sort(()=>Math.random()-0.5);
}
function generateQuestions(){
    questions=[];
    for(let i=1;i<=50;i++){
        let expr=generateExpression();
        let correct=eval(expr);
        let options=generateOptions(correct);
        questions.push({q:expr, ans:correct, options:options, selected:null});
    }
}

function showQuestion(){
    let q=questions[currentQuestion-1];
    let html=`<h3>Q${currentQuestion}: ${q.q}</h3>`;
    q.options.forEach(opt=>{
        html+=`<div class="option"><label><input type="radio" name="q${currentQuestion}" value="${opt}">${opt}</label></div>`;
    });
    document.getElementById("questionContainer").innerHTML=html;
    if(q.selected){
        document.querySelector(`input[name="q${currentQuestion}"][value="${q.selected}"]`).checked=true;
    }
}

function startTest(num){
    currentTest=num; currentQuestion=1;
    document.getElementById("selectPage").style.display="none";
    document.getElementById("testPage").style.display="block";
    document.getElementById("testTitle").innerText=`Test ${num} of 20`;
    generateQuestions(); showQuestion(); resetTimer();
    startTime=new Date();
}

function resetTimer(){
    clearInterval(timerInterval); timeLeft=600; updateTimer();
    timerInterval=setInterval(()=>{
        timeLeft--; updateTimer();
        if(timeLeft<=0) submitTest();
    },1000);
}

function updateTimer(){
    let m=Math.floor(timeLeft/60), s=timeLeft%60;
    let timer=document.getElementById("timer");
    timer.innerText=`${m}:${s<10?"0"+s:s}`;
    if(timeLeft<=60) timer.classList.add("alert");
    else timer.classList.remove("alert");
}

function saveAnswer(){
    let selected=document.querySelector(`input[name="q${currentQuestion}"]:checked`);
    questions[currentQuestion-1].selected=selected?selected.value:null;
}

function nextQuestion(){ saveAnswer(); if(currentQuestion<totalQuestions) currentQuestion++; showQuestion(); }
function prevQuestion(){ saveAnswer(); if(currentQuestion>1) currentQuestion--; showQuestion(); }
document.addEventListener("keydown",(e)=>{if(e.key==="ArrowRight") nextQuestion(); if(e.key==="ArrowLeft") prevQuestion();});

function submitTest(){
    clearInterval(timerInterval); saveAnswer(); endTime=new Date();
    let timeTaken=Math.floor((endTime-startTime)/1000), attempted=0, correct=0, wrong=0;
    questions.forEach(q=>{if(q.selected){attempted++; if(parseInt(q.selected)===q.ans) correct++; else wrong++;}});
    let marks=correct;
    let min=Math.floor(timeTaken/60), sec=timeTaken%60;
    document.getElementById("resultBox").innerHTML=`
        <p><b>Time Taken:</b> ${min} min ${sec} sec</p>
        <p><b>Attempted:</b> ${attempted}</p>
        <p><b>Correct:</b> ${correct}</p>
        <p><b>Wrong:</b> ${wrong}</p>
        <p><b>Final Marks:</b> ${marks} / 50</p>
    `;
    document.getElementById("testBtn"+currentTest).classList.add("completed");
    document.getElementById("testPage").style.display="none";
    document.getElementById("resultPage").style.display="block";
}

function backToMenu(){
    clearInterval(timerInterval);
    document.getElementById("testPage").style.display="none";
    document.getElementById("resultPage").style.display="none";
    document.getElementById("selectPage").style.display="block";
}
