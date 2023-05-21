var isChrome = !!window.chrome;
if (!isChrome) {
	alert("Currently Vocent is available in Chrome only");
}

let details ={}
let speaking = false


const send_mail = async (details) => {
	let axiosConfig = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		let res = await axios.post("/", details, axiosConfig);
		//console.log(res, "res");
		converse(
			"Mail Sent Successfully. Who would you like to send the next email?"
		);
	} catch (err) {
		//console.log("ERR", err, err.response);
		converse("Error Occured")
	}
	// //console.log("mail",details)
	details = {}
	//console.log("mail_reset",details)

				
};
function validateEmail(email) {
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}


let names = ['akash','anirudh','shrey','sumit']
let emails = {
	'anirudh':"aroy00708@gmail.com",
	'shrey':"shreyrs6801@gmail.com",
	'sumit':"sumitsrana15@gmail.com",
	'akash':"anandakash8317@gmail.com"
}

const getEmail = (name)=>{
	return emails[name]
}

const texts = document.querySelector(".texts");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement("p");

recognition.addEventListener("result", (e) => {
  texts.appendChild(p);
  //console.log(speaking)
  if(speaking){
	  return
  }
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = text;
  if (e.results[0].isFinal) {
    if (text.includes("at the rate") || names.includes(text.toLowerCase())) {
			//console.log(text, "text");
			reciever =
				names.includes(text.toLowerCase())
					? getEmail(text.toLowerCase())
					: text.replace("at the rate ", "@").replace(" ", "");
			if (validateEmail(reciever)) {
				converse(
					`The email is : ${reciever}. \n what would you like to say or say reset if incorrect?`
				);
				details["receiver_email"] = reciever;
				//console.log(details);
			} else {
				converse("Invalid email! Please say a valid one");
			}
		} else {
			if (details["receiver_email"]) {
				if(text.toLowerCase().includes('reset')){
					converse("Who would you like to send the email?")
				}else{
					details["message"] = text;
					send_mail(details)
				}
			}else {
				converse(
					"Can't understand please try again to tell reciever's email"
				);
			}
		}
    p = document.createElement("p");
  }
});

recognition.addEventListener("end", () => {
  recognition.start();
});

recognition.start();




const synth = window.speechSynthesis;

const speak = (message) => {
	// Check if speaking
	if (synth.speaking) {
		console.error("Already speaking...");
		return;
	}
	if (message !== "") {
		// Get speak text
		const speakText = new SpeechSynthesisUtterance(message);

		// Speak end
		speakText.onend = (e) => {
			//console.log("Done speaking...");
			// body.style.background = '#141414';
		};

		// Speak error
		speakText.onerror = (e) => {
			console.error("Something went wrong", e);
		};
		// Set pitch and rate
		speakText.rate = 1;
		speakText.pitch = 1;
		// Speak
		synth.speak(speakText);
	}
};

function converse(message) {
	
	p = document.createElement("p");
	p.classList.add("reply");
	p.innerText = message;
	speak(message);
	texts.appendChild(p);
}

converse(
	"Hi, I will convey your messages via email, who would you like to send this email?"
);

