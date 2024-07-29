
const displayError = (field) => {
  let p = document.createElement('p');
  p.innerHTML = "* Required";
  field.insertAdjacentElement('afterend' , p);
  p.classList.add('validated');
  p.style.color = 'red';
  p.style.margin = '0px';
  p.style.fontSize = '12px';

  return false;
}

let one_time = document.querySelector('.one-time');
let reccuring_time = document.querySelector('.reccuring_type');

let daily = document.querySelector('.daily');
let weekly = document.querySelector('.weekly');

one_time.style.display = 'none';
reccuring_time.style.display = 'none';

daily.style.display = 'none';
weekly.style.display = 'none';

let medicineType = document.getElementById('medicine-type');
medicineType.addEventListener('change' , handleChangeType)
function handleChangeType(e){
  let currType = e.target.value;

  if(currType === 'one_time'){
    one_time.style.display = 'block';

    reccuring_time.style.display = 'none';
    daily.style.display = 'none';
    weekly.style.display = 'none';
  }
  else if(currType === 'reccuring'){
    reccuring_time.style.display = 'block'
    one_time.style.display = 'none';
  }
}

let reccuringTypes = document.getElementById('reccuring_type');
function handleReccuringType(e){
  let currType = e.target.value;

  if(currType == 'daily'){
    daily.style.display = 'block';
    weekly.style.display = 'none';
  }
  else if(currType = 'weekly'){
    weekly.style.display = 'block';
    daily.style.display = 'none';
  }
}
reccuringTypes.addEventListener('change' , handleReccuringType);


function validateForm(){

  let validated = document.querySelectorAll('.validated');
  let isValid = true;

  if(validated.length >  0){
    console.log("Length is: " , validated.length)
    validated.forEach((item) => {
      item.remove();
    })
  }

  let dvalid = document.querySelectorAll('.dvalid');
  dvalid.forEach((field) =>{
    if(field.value.trim() == ""){
      isValid = displayError(field);
    }
  });

}

function disablePast(){
  let today = new Date();
  let day = String(today.getDate()).padStart(2 , '0');
  let month = String(today.getMonth() + 1).padStart(2 , '0');
  let year = String(today.getFullYear());

  today = year + '-' + month + '-' + day;
  document.getElementById('date').setAttribute("min" , today);

  
  let dailyStratDate = document.getElementById('daily-start-date');
  let dailyEndDate = document.getElementById('daily-end-date');
  
  dailyStratDate.setAttribute("min" , today);
  
  dailyStratDate.addEventListener('focusout' ,() => {
    dailyEndDate.setAttribute('min' , dailyStratDate.value);
  });

  
  let weeklyStratDate = document.getElementById('weekly-start-date');
  let weeklyEndDate = document.getElementById('weekly-end-date');

  weeklyStratDate.setAttribute("min" , today);
  
  weeklyStratDate.addEventListener('focusout' ,() => {
    weeklyEndDate.setAttribute('min' , weeklyStratDate.value);
  });

}
disablePast();