import {fetchMovieAvailability,fetchMovieList} from "./api.js";

let count = 0;
const movieholder = document.getElementById('movie-holder');

const list = await fetchMovieList();
console.log(list);

for (let i=0; i<list.length; i++) {

    var link =  list[i].imgUrl;
    // console.log(link);
    
    var h4 = document.createElement('h4');
    h4.innerHTML = list[i].name;
    // console.log(h4);

    var movieImg = document.createElement('div');
    movieImg.setAttribute('class', 'movie-img-wrapper');

    movieImg.setAttribute("style", "background-image: url("+link+");background-size: cover");
    
    var movieData = document.createElement('div');
    movieData.addEventListener('click', showAvail);
    movieData.setAttribute('class', 'movie');
    movieData.setAttribute('id', `${i}`);
    movieData.setAttribute('data-d', list[i].name);
    movieData.appendChild(movieImg);
    movieData.appendChild(h4);

    var a = document.createElement('a');
    a.setAttribute('class', 'movie-link');
    // a.setAttribute('href', "#");
    a.appendChild(movieData);

    movieholder.appendChild(a);

}

async function showAvail(event) {
    console.log("One poster is clicked")
    var movieName = event.path[1].id;
    console.log('movieName: '+movieName)
    var i = parseInt(movieName);
    // console.log(typeof(i));
    
    const seats = await fetchMovieAvailability(list[i].name);
    console.log(seats);

    const booker = document.getElementById('booker')
    booker.classList.remove('d-none');
    let localStorageData = JSON.parse(localStorage.getItem('previous'));
    // console.log("localStorageData "+localStorageData)

    if (count > 0) {
        var s = seats.length;
        for(let x=0; x<localStorageData.length; x++){
            if (x<=seats.length-1){
                document.getElementById(`booking-grid-${seats[x]}`).classList.add('available-seat');
            }
        }
    }

    for (let k=0; k<24; k++) {
        var bookingGrid = document.getElementById(`booking-grid-${k+1}`)
        // console.log(bookingGrid);
        if(count > 0) {
            if (bookingGrid.classList.contains('available-seat')){
                bookingGrid.classList.remove('available-seat')
            }
        }
        bookingGrid.classList.add('unavailable-seat');
        // console.log(bookingGrid);
    }

    let arr = [];
    
    for(let j=0; j<seats.length; j++) {
        var bookingGrid = document.getElementById(`booking-grid-${seats[j]}`)
        arr.push(seats[j]);
        console.log(seats[j]);
        // if (bookingGrid.classList.contains('unavailable-seat')){
        //     bookingGrid.classList.remove('unavailable-seat')
        // }
        document.getElementById(`booking-grid-${seats[j]}`).classList.add('available-seat');
        bookingGrid.addEventListener('click', () => {
            bookingGrid.classList.add('selected-seats');
        });
        
    }
    count++;
    // console.log(count+" "+arr);
    localStorage.setItem("previous",JSON.stringify(arr));
    // document.getElementById('bookingGrid1').classList.add('unavailable-seat');



    for(let j=0; j<seats.length; j++) {
        var bookingGrid = document.getElementById(`booking-grid-${seats[j]}`)
        // arr.push(seats[j]);
        console.log(seats[j]);
        // if (bookingGrid.classList.contains('unavailable-seat')){
        //     bookingGrid.classList.remove('unavailable-seat')
        // }
        bookingGrid.classList.add('available-seat');
        bookingGrid.addEventListener('click', select);   
    }
}
var totalSeats = 0;
var selectedSeats = [];
function select (event) {
    totalSeats++;
    // console.log("seats- "+event.path[0].innerHTML);
    selectedSeats.push(event.path[0].innerHTML);
    const seat = document.getElementById(event.path[0].id)
    seat.classList.add('selected-seats');
    seat.removeEventListener('click', select);
    seat.addEventListener('click', unselect);
    console.log(totalSeats);
    showButton();

}
function unselect(event) {
    totalSeats--;
    selectedSeats.pop();
    const seat = document.getElementById(event.path[0].id);
    seat.classList.remove('selected-seats');
    seat.removeEventListener('click', unselect);
    seat.addEventListener('click', select);
    showButton();
}

var bookTicketBtn = document.querySelector('#book-ticket-btn');

function showButton () {
    if (totalSeats > 0) {
        bookTicketBtn.classList.remove('v-none')
    }
    else {
        bookTicketBtn.classList.add('v-none')
    }
}

var booker = document.getElementById('booker');
bookTicketBtn.addEventListener('click', () => {
    booker.innerHTML = "";
    console.log(selectedSeats.join(','));
    confirmPurchaseDiv();
    // confirm.classList.remove('d-none');
    h3.innerHTML = "Confirm your booking for seat numbers: "+selectedSeats.join(",");
    console.log("Book My Seats button is clicked");
});
// console.log(bookTicketBtn);

var confirm = document.createElement('div');
var br1 = document.createElement("br");
var br2 = document.createElement("br");
var h3 = document.createElement('h3');

//when we click on Book My Ticket button
function confirmPurchaseDiv () {
    var label1 = document.createElement('Label');
    label1.innerHTML = "Email: ";
    var email = document.createElement("input");
    email.id = "input_email"
    email.setAttribute("type", "tel");
    email.setAttribute("name", "emailID");
    email.setAttribute("placeholder", "E-Mail ID");

    var label2 = document.createElement('Label');
    label2.innerHTML = "Phone no.: ";
    var phone = document.createElement("input");
    phone.id = "input_phone_no";
    phone.setAttribute("type", "tel");
    phone.setAttribute("name", "phone-no.");
    phone.setAttribute("placeholder", "Phone-no.");

    var purchase = document.createElement("input");
    purchase.setAttribute("type", "submit");
    purchase.setAttribute("value", "Purchase");
    purchase.addEventListener('click', showTicket)

    var form = document.createElement('form');
    form.setAttribute('id', 'customer-detail-form');
    form.appendChild(label1);
    form.appendChild(email);
    form.appendChild(br1);
    form.appendChild(label2);
    form.appendChild(phone);
    form.appendChild(br2);
    form.appendChild(purchase);

    h3.innerHTML = "Confirm your booking for seat numbers: ";

    confirm.setAttribute('id', 'confirm-purchase');
    confirm.appendChild(h3);
    confirm.appendChild(form);

    booker.appendChild(confirm);

    console.log("seats "+selectedSeats.join(','));
}

// when we click on Purchase button
function showTicket() {
    var phoneNo = document.getElementById('input_phone_no').value;
    var email = document.getElementById('input_email').value;

    booker.innerHTML = "";

    var h3 = document.createElement('h3');
    h3.innerHTML = "Booking details"

    var p1 = document.createElement('p');
    p1.innerHTML = "Seats: " + selectedSeats.join(',');

    var p2 = document.createElement('p');
    p2.innerHTML = "Phone number:" + phoneNo;
    
    var p3 = document.createElement('p');
    p3.innerHTML = "Email:" + email;

    var div = document.createElement('div');
    div.id = "Success";
    div.appendChild(h3);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);

    booker.appendChild(div);
}