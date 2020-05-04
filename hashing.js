

var db = firebase.firestore();

//Get user object of current user
//var user = firebase.auth().currentUser;
//console.log(user);
//doc_id = user.uid;

//document id of first question in database(saved as hash code)
const lvl1="b16d7a03a24d35c3434f78ea1f09a0ac177f64769772df7d8f2cf07940de865f";

function right(newhash){
    console.log("Correct Answer");
    var date = new Date();
    var time_stamp = date.getTime();
    console.log(time_stamp);
    db.collection('users').doc("HwZAWuGq5RY3QF1y4q7E7PTNFO52").update({
        level : firebase.firestore.FieldValue.increment(1),
        prevhash : newhash,
        timestamp : time_stamp
    })
    .then(function(){
        console.log("Database Updated");
        var x=document.getElementById('sbox');
        x.innerHTML="";
        var y=document.getElementById('answerbox');
        y.innerHTML="";
        var display_div = document.createElement('div');
        display_div.innerHTML = "<h2>CORRECT ANSWER! GOING TO NEXT LEVEL</h2>"
        document.getElementById('sbox').appendChild(display_div);
        setTimeout(() => { playgame(); }, 1000);
    })
}

function wrong(){
    var x=document.getElementById('sbox');
    x.innerHTML="";
    var y=document.getElementById('answerbox');
    y.innerHTML="";
    var display_div = document.createElement('div');
    display_div.innerHTML = "<h2>WRONG ANSWER! TRY AGAIN</h2>"
    document.getElementById('sbox').appendChild(display_div);
    setTimeout(() => { playgame(); }, 1000);

}

function action(f,newhash){
    if(f==1){
        right(newhash)
    }else{
        wrong();        
    }
}


function check_ans(ans_hash){
    let flag = 0;
    db.collection('testQnA').get().then((snapshot) =>{
        snapshot.docs.forEach(doc =>{
            if(doc.id==ans_hash){
                flag = 1;
            }
        })
        action(flag,ans_hash);
    })
}


function hash_ans(qref,hashref){
    let ans = document.getElementById('answer').value;
    let before_hash = hashref.concat(qref,ans);
    let hash = CryptoJS.SHA256(before_hash);
    let encryptedans = hash.toString(CryptoJS.enc.Hex)
    check_ans(encryptedans);
}


function print_ques(ques,hashref){

    var x=document.getElementById('sbox');
    x.innerHTML="";
    var y=document.getElementById('answerbox');
    y.innerHTML="";

    var display_div = document.createElement('div');
    var answer_div = document.createElement('div');
    var butn = document.createElement('BUTTON');

    display_div.innerHTML = "<h2>'"+ ques +"'</h2>"
    answer_div.innerHTML = "<input type='text' id='answer'><br><br>"
    butn.innerHTML = "SUBMIT";
    butn.onclick = function(){hash_ans(ques,hashref)};
    
    document.getElementById('sbox').appendChild(display_div);
    document.getElementById('answerbox').appendChild(answer_div);
    document.getElementById('answerbox').appendChild(butn);
    
}
function get_ques(actual_hash){
    db.collection('testQnA').get().then((snapshot) =>{
        snapshot.docs.forEach(doc =>{
            if(doc.id===actual_hash){
                print_ques(doc.data().question,actual_hash);
            }
        })
    })
}

function check_lvl(cuserdata){
    if(cuserdata.level==1){
        get_ques(lvl1);
    }else{
        get_ques(cuserdata.prevhash);//field prevhash to be created in each user document
    }
}

function playgame(){
    console.log('dsdsd');
    db.collection('users').get().then((snapshot) => {
        snapshot.docs.forEach(doc =>{
            if(doc.id=="HwZAWuGq5RY3QF1y4q7E7PTNFO52"){
            check_lvl(doc.data());//passing current user's data
            }
        })
    })

}

