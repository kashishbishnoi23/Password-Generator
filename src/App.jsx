import { useCallback, useEffect, useState, useRef } from 'react'


// useCallback() hook : dekho bhai react hame ek functionality provide karta hai ki ye ek virtual DOM banata hai -> re-render pe naya virtual DOM banega -> naye wale virtual DOM ko purane wale ke sath compare kiya jayega -> jo changes honge sirf unko actual DOM me update kiya jayega -> so why do we need useCallback?? -> actually functions thoda different tareeke se kaam krte hain -> har re-render pe function create hota hai -> yani even if the logic inside the function is exactly same -> jitni baar re-render hoga -> function create hoga -> ham asa nahi chahte -> ham chahte hai ki function ka agr logic change ho -> sirf tabhi function recreate ho -> so useCallBack ye krta ha ki -> function ko cache me store krwa leta hai -> agar function ki dependencies change nahi hui hai -> to vo us function ko cache se utha leta hai -> otherwise function recreate hota hai


//  okay so listen : 

// Hamaare paas ek App component hai -> jitni baar koi state change hoti hai -> using useState hook -> utni baar hamara App component render hota hai -> jab App component render hota hai -> to hmaare sare function recrrate ho rahe the -> but agar hamne useCallBack ka use kr liya -> to useCallBack me pass ki gayi dependencies jab change hongi -> sirf tabhi hamaara function recreate hoga -> otherwise cache me purana version saved hai -> wahi function use ho jayega 

// ab ye passwordgenerator call kab ho ?? -> dekho bhai -> ek to ye kaam ho skta hai ki aap ek button lagaado -> jab jab button pe click ho tab tab function call ho jaye -> will cause no problems 

// but if you don't want to do that and directly call the function what happens:

// function call hoga -> usme setPassword, setLength jase functions hain -> jo state updates krenge -> jab jab state update hoti hai -> pura component re-render hota hai -> App re-render hoga -> function dubara call ho jayega -> App fir se re-render hoga -> too many re-renders -> infinite loop

//  so ab ham ye chahte hai ki maanlo App component me 1 se jyada functions hai -> for instance, we have two functions A and B -> ab dono functions me se kisi ki bhi dependency change hogi -> to App component re-render hoga -> aur dono functions call ho jayenge -> agar B ki state change hui to A wala function bhi call ho jayega -> but we want ki jis function ki dependency change ho -> sirf wahi function call ho -> isliye ham useEffect ka use krte hain -> we pass the function and dependencies -> ab jab ye dependencies change hongi -> sirf tabhi function call hoga -> so the function won't be called on every re-render

// working kinda similar to useCallBack  -> waha function create tab hoga -> jab dependency change hogi 

// yaha function call tab hoga -> jab dependencies change hogi

// why do we pass the function itself to useEffect -> ho skta hai function khud change hua to -> is case me bhi function run hona chahiye -> to run the updated version of the function


// useRef hook:

// okay so listen, useState kya tha??? -> kisi variable wagarah ki state change ho to UI me bhi update ho jaye -> isliye jitni baar state updates hote the hamaara poora component re-render hota hai , but sometimes we don't want that ham chahte hain ki hamaari information saved ho -> but use change krne par -> hamara pura component re-render na ho -> because uski state change hone se UI me koi fark nhi pad raha -> is case me ham useRef ka use krte hain -> state persists through re-renders.


// const passwordRef = useRef(null) 
// is varoiable passwordRef me ham koi value ya element store krwayenge -> jo change hoga but we don't want the whole component to re-render when it changes  -> initialize kr diya null se

//  inside the input element : ref={passwordRef} -> attaching passwordRef to input element

//  now after rendering passwordRef.current holds the reference of actual DOM element of this input

/*
passwordRef.current refers to the actual DOM element (<input>).
passwordRef.current?.select() selects the entire text inside the input field.
passwordRef.current?.setSelectionRange(0,5) specifically selects the range from index 0 to 5 inside the text (though this could be adjusted to dynamically select based on password length).
*/




// useCallBack me 2 arguements pass hoti hain -> function and its dependencies
function App() {

  // creating variables:

  let [password, setPassword] = useState("");
  let [length, setLength] = useState(5);

  let [upperAllowed, setupperAllowed] = useState(false);

  let [lowerAllowed, setlowerAllowed] = useState(false);

  let [numbersAllowed, setnumbersAllowed] = useState(false);

  let [specialcharsAllowed, setSpecialAllowed] = useState(false);

  let [isCopied, setCopied] = useState(false);




  // dependencies kya hai ->length, upperAllowed, lowerAllowed, numbersAllowed -> inke change hone se function change hoga -> which function -> passwordGenerator 

  // create the function PasswordGenerator

  const PasswordGenerator = useCallback(() => {

    let pass = "";
    let temp = "";
    if (!upperAllowed && !lowerAllowed && !numbersAllowed && !specialcharsAllowed){
      temp = "Yc$T2"
    } else{
      temp = "";
    }


    if (upperAllowed){ 
      temp += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      

    };
    if (lowerAllowed) {
      temp += "abcdefghijklmnopqrstuvwxyz"
    
    };
    if (numbersAllowed){
      temp += "012345678901234567890123456789"
    

    }
    ;
    if (specialcharsAllowed){ 
      temp += "`~!@#$%^&*()\"-_=+[{]}\\|;:',<.>/?"
    
    }

    let a = 0;

    while (a < length) {
      let random_index = Math.floor(Math.random() * ((temp.length) - 1));
      pass += temp[random_index];
      a++;
    }

    setPassword(pass);
   

    

  


  }, [length, upperAllowed, lowerAllowed, numbersAllowed, specialcharsAllowed, setPassword]);


  //  PasswordGenerator(); 

  // without button: if any of the dependencies change -> call the function
  
  useEffect(() => {
    PasswordGenerator();
  }, [length, upperAllowed, lowerAllowed, numbersAllowed, specialcharsAllowed])


//  with button:


  // copy to clipboard:
  let copyToClipboard = useCallback(() => {
    // ham directly window likh paa rhe hain cuz hame at end window object ka access milega browser me 
    console.log(passwordRef.current);
    passwordRef.current?.select();
    // kitna range select krna hai:
    // passwordRef.current?.setSelectionRange(0, 5);
    window.navigator.clipboard.writeText(password);
    setCopied(true);

  }, [password])


  // useRef hook:
  const passwordRef = useRef(null);


  return (
    <>

    <div className="text-white">
   <h1 className="text-gray-500 text-lg font-semibold text-center">Password Generator</h1>

   <div className="bg-bg-gray flex items-center justify-between w-[28vw] my-5 p-4">

            {/* <input placeholder="Password" type="text" className="password bg-bg-gray outline-none"/> */}
            <input type='text'
            name='password'
            placeholder='Password'
            value={password}
            className='outline-none bg-bg-gray'
            readOnly
            ref={passwordRef}
          />

        
            <button className="copy"
            onClick={copyToClipboard}>
              {!isCopied? (
                <svg className="copy_img" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="24px"
                    fill="#A4FFAF">
                    <path
                        d="M760-200H320q-33 0-56.5-23.5T240-280v-560q0-33 23.5-56.5T320-920h280l240 240v400q0 33-23.5 56.5T760-200ZM560-640v-200H320v560h440v-360H560ZM160-40q-33 0-56.5-23.5T80-120v-560h80v560h440v80H160Zm160-800v200-200 560-560Z" />
                </svg>) :
                (
                <svg className="done_img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#A4FFAF"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
              )}
            </button>

        </div>


        <div className=" flex flex-col gap-4 p-5 py-8 bg-bg-gray h-fit w-[28vw]">


          <div className="flex justify-between w-full">
                <div>Length </div>
                <div className="text-green text-xl length">{length}</div>
          </div>

          <input type="range"
            value={length}
            min={0} max={20}
           onChange={(event) => { setLength(event.target.value) }}/>
          
      
            <div className="flex items-center gap-5">
                <input type="checkbox" id="1"  
                 onChange={() => {
                setupperAllowed((prev) => !prev);
              }} />
                <label htmlFor="1">
                <div>Include UpperCase Letters </div>
                </label>
            </div>

          
            <div className="flex items-center gap-5">
                <input type="checkbox" id="2" className="lowercase"
                   onChange={() => {
                    setlowerAllowed((prev) => !prev);
                  }}/>
                <label htmlFor="2">
                <div> Include LowerCase Letters</div>
                </label>
            </div>

         
            <div className="flex items-center gap-5">
                <input type="checkbox" id="3" className="numbers"
                  onChange={() => {
                    setnumbersAllowed((prev) => !prev);
                  }}/>
            <label htmlFor="3">
                <div>Include Numbers</div>
            </label>
              
            </div>
    
            
           
            <div className="flex items-center gap-5">
                <input type="checkbox" id="4" className="symbols"
                onChange={() => {
                      setSpecialAllowed((prev) => !prev);
                }}/>
                <label htmlFor="4">
                <div>Include Symbols</div>
                </label>
            </div>

        
{/* 
            <button className="generate-btn bg-green font-semibold p-3 my-4 text-black"
            onClick={PasswordGenerator}
            >
                GENERATE
            </button> */}
          
          </div>
          </div>
     
            
           






    </>
  )
  }


export default App


