// Side Nav

displayLoader(3000);
$('.side-nav').css('left' , -$('.side-nav-inner').innerWidth())
const sideNavWidth = $('.side-nav-inner').innerWidth();
$('.side-nav-icons').click(function(){
    if($('.side-nav').css('left') === '0px'){
        closeSideNav(sideNavWidth);
    }
    else{
       openSideNav();
    }

})

function closeSideNav(sideNavWidth){
    $('.side-nav').css('left' , -sideNavWidth)
    $('.side-nav-inner .navs li').each(function(i){
        $(this).animate({top  :'200px'})
    })
    $('.side-nav-icon .c').removeClass('fa-x');
    $('.side-nav-icon .c').addClass('fa-bars');
}
function openSideNav(){
    $('.side-nav').css('left' , 0)
        
    $('.side-nav-inner .navs li').each(function(i){
        $(this).animate({top  :0}, (i+5)*60)
    })
    
    $('.side-nav-icon .c').removeClass('fa-bars');
    $('.side-nav-icon .c').addClass('fa-x');
    
}

// Display Loader 
function displayLoader(time){
    $('.loading').css({display : 'flex'});
    $('.loading').fadeOut(time);
}

// Display Meals 

let meals = [] ;

displayLoader(1500);
async function getMealByName(name,row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    var data = await response.json();
    meals=data.meals;
    displaymeals(meals , row);
    displayLoader(500);
}

async function getMealByFirstLetter(name,row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`)
    var data = await response.json();
    meals=data.meals;
    displaymeals(meals , row);
    displayLoader(500);
}
async function getMealById(id){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    var data = await response.json();
    meals=data.meals[0];
    mealValues=Object.values(meals);
    displayMealDetails(meals,mealValues);
}

// Display Each Meal Details

function displayMealDetails(meal,mealValues){
    var li ='';
    for(let i =29 ; i<49 ;i++){
        if(!mealValues[i].trim()){
            break;
        }
        li+=`
        <li class="alert alert-info mx-2 p-1">${mealValues[i]} ${mealValues[i-20]}</li>
        `    
   }


    var container = `
    <div class="close-icon position-absolute">
    <i class="fas fa-x fa-2xl  "></i>
    </div>

    <div class="col-md-4">
    <img src="${meal.strMealThumb}" class="w-100" alt="">
    <h3 class="pt-3">${meal.strMeal}</h3>
    </div>

    <div class="col-md-8">
    <h3>Instructions</h3>
    <p style="letter-spacing:1.1px;">${meal.strInstructions}</p>
    <h4 class="fs-2 fw-semibold">Area : ${meal.strArea}</h4>
    <h4 class="fs-2 fw-semibold">Category : ${meal.strCategory}</h4>
    <h4 class="fs-2 fw-semibold">Recipes :</h4>
    
    <ul class="recipes-ul list-unstyled d-flex flex-wrap  my-3">
        ${li}
    </ul>
    
    <h4 class="fs-2 fw-semibold">Tags :</h4>
    <div class="alert alert-danger p-1 m-3" style="width: fit-content;">${meal.strTags}</div>

    <a href="${meal.strSource}" target="_blank" class="btn btn-success">Source</a>
    <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>

   </div>
        
    `


    $('.recipes-ul').html(li)
    $('.row.meal-details').html(container)

    $('.close-icon i').click(function(){
        displayLoader(1000);
        $('.row.meal-details').fadeOut(0);
        $('.row.meals').css({'display': 'flex'},0);
    
    })
    
}

async function getCategories(row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    var data = await response.json();
    meals=data.categories;
    displayCategories(meals , row);
    displayLoader(1000);
    
}

// Set And Display Areas and their meals

async function getAreas(row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    var data = await response.json();
    meals=data.meals;

    displayLoader(1000);
    displayareas(meals,row)
}

async function filterareas(name,row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`)
    var data = await response.json();
    var meals=data.meals;
    displayAreaMeals(meals,row);
    
}

// Display All Areas

 function displayareas(meals ,row){
    var container = '' ;
    for(let i =0 ; i<meals.length ;i++ ){
         container += `
         <div class="areas col-md-3 pb-2">
         <i class="fas fa-house-laptop display-2 "></i>
         <div class="area-name p-3">
         <h4>${meals[i].strArea}</h4>
         </div>
        </div>
            ` 
        $(row).html(container)
        $(row).css('display','flex');
    }

    
    $('.areas.col-md-3 , .areas h4').click( async function(){
        const AreaName = $(this).text().trim();
        $('.row.areas').fadeOut(0);
        $('.row.area-meals').css({'display': 'flex'},0);
         filterareas(AreaName,'.row.area-meals');
        displayLoader(1000);

    })
}

// Display Area Meals

function displayAreaMeals(meals ,row){
    var container = '' ;
    let length =20
    if(meals.length<20){
        length =meals.length;
    }
    for(let i =0 ; i<length ;i++ ){
         container += `
            <div class="column col-md-3 p-0   ">
            <div class="resizer p-3  ">
            <div class="product-image position-relative overflow-hidden">
            <img src="${meals[i].strMealThumb}" class="w-100 " alt="mmm">
            <div id="${meals[i].idMeal}" class="overlay fs-2 p-2 fw-semibold">
            ${meals[i].strMeal}
            </div>
            </div>
            </div>
            </div> ` 
        $(row).html(container)
    }
    
    $('.area-meals .overlay').click(function(){
        const id = $(this).attr('id');

        $('.row.area-meals').fadeOut(0);
        displayLoader(500);
        getMealById(id);
        $('.row.meal-details').css({'display': 'flex'},0);
        
    })
}


// Get and display ingredients meals 

async function getIngredients(row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    var data = await response.json();
    meals=data.meals;
    displayLoader(1000);
    displayIngredients(meals,row);
}

async function filterIngredients(name,row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`)
    var data = await response.json();
    var meals=data.meals;
    displayIngredientsMeals(meals,row);
    
}


function displayIngredients(meals ,row){
    var container = '' ;
    length = 20 ;
    for(let i =0 ; i<length ;i++ ){
        let strDescription =meals[i].strDescription;
        if(strDescription.length > 85){
            strDescription =strDescription.slice(0,85)
        }

         container += `
         <div class=" ingredients col-md-3 pb-2">
         <i class="fas fa-drumstick-bite display-2 "></i>
         <div class="ingredient-name p-3">
         <h4>${meals[i].strIngredient}</h4>
         <p>${strDescription}</p>
         </div>
        </div>
            ` 
        $(row).html(container)
        $(row).css('display','flex');
    }

    
    $('.ingredients.col-md-3 , .ingredients h4').click( async function(){
        const AreaName = $(this).find('h4').text().trim();
        $('.row.ingredients').fadeOut(0);
        $('.row.ingredients-meals').css({'display': 'flex'},0);
        filterIngredients(AreaName,'.row.ingredients-meals');
        displayLoader(1000);

    })
}



function displayIngredientsMeals(meals ,row){
    var container = '' ;
    let length =20;
    if(meals.length<20){
        length =meals.length;
    }
    for(let i =0 ; i<length ;i++ ){
         container += `
            <div class="column col-md-3 p-0   ">
            <div class="resizer p-3  ">
            <div class="product-image position-relative overflow-hidden">
            <img src="${meals[i].strMealThumb}" class="w-100 " alt="mmm">
            <div id="${meals[i].idMeal}" class="overlay fs-2 p-2 fw-semibold">
            ${meals[i].strMeal}
            </div>
            </div>
            </div>
            </div> ` 
        $(row).html(container)
    }
    
    $('.ingredients-meals .overlay').click(function(){
        const id = $(this).attr('id');
        $('.row.ingredients-meals').fadeOut(0);
        displayLoader(500);
        getMealById(id);
        $('.row.meal-details').css({'display': 'flex'},0);
        
    })
}




async function filterCategories(name,row){
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`)
    var data = await response.json();
    meals=data.meals;
    displayCategoryMeals(meals,row);
    
}

getMealByName('','.row.meals');


function displaymeals(meals ,row){
    
    var container = '' ;
    for(let i =0 ; i<meals.length ;i++ ){
         container += `
            <div class="column col-md-3 p-0   ">
            <div class="resizer p-3  ">
            <div class="product-image position-relative overflow-hidden">
            <img src="${meals[i].strMealThumb}" class="w-100 " alt="">
            <div id="${meals[i].idMeal}" class="overlay  fs-2 p-2 fw-semibold">
            ${meals[i].strMeal}
            </div>
            </div>
            </div>
            </div> ` 
        $(row).html(container)
       
    }

    $('.overlay').click(function(){
        const catagoryName = $(this).attr('id');
        $(row).fadeOut(0);
        displayLoader(500);
        getMealById(catagoryName);
        $('.row.meal-details').css({'display': 'flex'},0);
        
    })

    
}

// Display each category meals

function displayCategoryMeals(meals ,row){
    var container = '' ;
    let length =20
    if(meals.length<20){
        length =meals.length;
    }
    for(let i =0 ; i<length ;i++ ){
         container += `
            <div class="column col-md-3 p-0   ">
            <div class="resizer p-3  ">
            <div class="product-image position-relative overflow-hidden">
            <img src="${meals[i].strMealThumb}" class="w-100 " alt="">
            <div id="${meals[i].idMeal}" class="overlay fs-2 p-2 fw-semibold">
            ${meals[i].strMeal}
            </div>
            </div>
            </div>
            </div> ` 
        $(row).html(container)
    }
    
    $('.overlay').click(function(){
        const catagoryId = $(this).attr('id');
        $('.row.categorie-meals').fadeOut(0);
        displayLoader(500);
        getMealById(catagoryId);
        $('.row.meal-details').css({'display': 'flex'},0);
        
    })
}

// Display All Categories

function displayCategories(meals ,row){
    var container = '' ;
    for(let i =0 ; i<meals.length ;i++ ){
         container += `
            <div class="column col-md-3 p-0   ">
            <div class="resizer p-3  ">
            <div class="product-image position-relative overflow-hidden">
            <img src="${meals[i].strCategoryThumb}" class="w-100 " alt="">
            <div class="overlay fs-2 p-2 fw-semibold">${meals[i].strCategory}</div>
            </div>
            </div>
            </div> ` 
        $(row).html(container)
    }

        $('.overlay').click(function(){
            const CategoryName = $(this).text();
            $('.row.categories').fadeOut(0);
            $('.row.categorie-meals').css({'display': 'flex'},0);
            filterCategories(CategoryName,'.row.categorie-meals');
            displayLoader(1000);

        })

}

// search Page

const searchByName = document.querySelector('.row.search input:nth-child(1)');
searchByName.addEventListener('input',function(){
    var searchInputName = searchByName.value;
    getMealByName(searchInputName,'.row-items')
 });

 const searchByFirstLetter = document.querySelector('.row.search .searchFirstLetter');
 searchByFirstLetter.addEventListener('input',function(){

    var searchInputFirstLetter = searchByFirstLetter.value;

    getMealByFirstLetter(searchInputFirstLetter,'.row-items');
 })


//  Form Validation 

const formName =document.querySelector('#name');
const NotvalidName =document.querySelector('#validName');

const formMail =document.querySelector('#email');
const NotvalidMale =document.querySelector('#validmail');

const formPhone =document.querySelector('#phone')
const Notvalidphone =document.querySelector('#validphone');

const formAge =document.querySelector('#age')
const Notvalidage =document.querySelector('#validage');

const formPass =document.querySelector('#pass')
const NotvalidPass =document.querySelector('#validpass');

const formrePass =document.querySelector('#repass')
const NotvalidrePass =document.querySelector('#validrepass');

const submitBtn =document.querySelector('#submit')

function validName(){
    return (/^[a-zA-Z ]+$/.test(formName.value))
}

function validMail(){
     return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formMail.value))
}

function validPhone(){
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formPhone.value))
}
function validAge() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(formAge.value))
}
function validPass() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(formPass.value))
}
function validrePass() {
    return (formPass.value === formrePass.value)
}

formName.addEventListener('input',()=>{
    if(validName()===true){
        NotvalidName.classList.add('d-none');
        NotvalidName.classList.remove('d-block');
    }
    else{
        NotvalidName.classList.add('d-block');
        NotvalidName.classList.remove('d-none');
    }
    submit();
})

formMail.addEventListener('input',()=>{
    if(validMail()===true){
        NotvalidMale.classList.add('d-none');
        NotvalidMale.classList.remove('d-block');
    }
    else{
        NotvalidMale.classList.add('d-block');
        NotvalidMale.classList.remove('d-none');
    }
    submit();
})

formPhone.addEventListener('input',()=>{
    if(validPhone()===true){
        Notvalidphone.classList.add('d-none');
        Notvalidphone.classList.remove('d-block');
    }
    else{
        Notvalidphone.classList.add('d-block');
        Notvalidphone.classList.remove('d-none');

    }
    submit();
})

formAge.addEventListener('input',()=>{
    if(validAge()===true){
        Notvalidage.classList.add('d-none');
        Notvalidage.classList.remove('d-block');
    }
    else{
        Notvalidage.classList.add('d-block');
        Notvalidage.classList.remove('d-none');

    }
    submit();
})

formPass.addEventListener('input',()=>{
    if(validPass()===true){
        NotvalidPass.classList.add('d-none');
        NotvalidPass.classList.remove('d-block');
    }
    else{
        NotvalidPass.classList.add('d-block');
        NotvalidPass.classList.remove('d-none');

    }
    submit();
})

formrePass.addEventListener('input',()=>{
    if(validrePass()===true){
        NotvalidrePass.classList.add('d-none');
        NotvalidrePass.classList.remove('d-block');
    }
    else{
        NotvalidrePass.classList.add('d-block');
        NotvalidrePass.classList.remove('d-none');

    }
    submit();
})

function submit (){
    if(validName()===true && validMail()===true && validPhone()===true
       && validAge()===true && validPass()===true && validrePass()===true )
       {
        submitBtn.classList.remove('disabled');
    }
    else
    {
         submitBtn.classList.add('disabled');
    }
}


// UL Li Clicks

$('.side-nav-inner .navs li').click(function(){
    const sideNavWidth = $('.side-nav-inner').innerWidth();
    closeSideNav(sideNavWidth);

    $('.row.meals').fadeOut(0);
    $('.row.search').fadeOut(0);
    $('.row.categorie-meals').fadeOut(0);
    $('.row.meal-details').fadeOut(0);
    $('.row.categories').fadeOut(0);
    $('.row.areas').fadeOut(0);
    $('.row.area-meals').fadeOut(0);
    $('.row.ingredients').fadeOut(0);
    $('.row.contact').fadeOut(0);
    $('.row.ingredients-meals').fadeOut(0);
    displayLoader(1500);
  
})

$('.side-nav-inner .navs li:nth-child(1)').click(function(){

    $('.row.search').css({'display': 'flex'},0);
    displayLoader(1500);
  
})

$('.side-nav-inner .navs li:nth-child(2)').click(function(){

    $('.row.categories').css({'display': 'flex'},0);
    getCategories('.row.categories');
    


})

// Area Page 


$('.side-nav-inner .navs li:nth-child(3)').click(function(){

    getAreas('.row.areas');


})


$('.side-nav-inner .navs li:nth-child(4)').click(function(){

    getIngredients('.row.ingredients');

})

$('.side-nav-inner .navs li:nth-child(5)').click(function(){

    displayLoader(1000);
    $('.row.contact').css({'display': 'flex'},0);

})

