const state = {
    vetId: null
}
 
const vetForm = document.querySelector ("#create-vet-form")
// console.log("vets: ", vetForm)
const animalForm = document.querySelector ("#create-animal-form")

const vetsListEl = document.querySelector(".vet-list")

const animalsListEl = document.querySelector(".animal-list")

let vets = []

fetch("http://localhost:3000/vets")
.then((res) => res.json())
.then((vetsData) => {
    // console.log("Inside Get Fetch: ", vetsData);

    vets = vetsData

    renderVetsList(vets)

});

function renderVetsList(vets) {
    // console.log("Inside renderVets: ", typeof vets)

// const listEl = document.createElement('ul')
// listEl.classList.add("vet-sidebar")
// listEl.classList.add("md-shadow")

let addedVet = ""

vetsListEl.innerHTML = ""

for (let i = 0; i < vets.length; i++) {
    const vet = vets[i];
    const id = vet.id;
    const foreName = vet.firstName;
    const surname = vet.lastName;

    const row = `ID: ${id} - ${foreName} ${surname}\n`;

    addedVet = addedVet + row;

    

    const listEl2 = document.createElement('li')
    const h3El = document.createElement('h3')
    h3El.innerText = row
    listEl2.append(h3El)

    const viewButton = document.createElement('button')
    viewButton.innerText = "View"
    viewButton.addEventListener("click", (event) => {
        event.preventDefault()
        state.vetId = id
        console.log(id)
        
        // console.log("animals: ", animalForm)
        document.getElementById("create-animals").removeAttribute("disabled")
    })
    listEl2.append(viewButton)

    vetsListEl.append(listEl2)
    // console.log("Iteration #", i + 1)
    // console.log("addedVet: ", addedVet)
}

// console.log(addedVet)

// document.body.append(vetsListEl)

}

function listenToCreateVetForm() {
    vetForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const firstNameInput = vetForm.querySelector('#first-name')
        const lastNameInput = vetForm.querySelector('#last-name')
        // console.log("Forename: ", firstNameInput.value)
        // console.log("Surname: ", lastNameInput.value)

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstNameInput.value,
                lastName: lastNameInput.value
            })
        };
        fetch("http://localhost:3000/vets", fetchOptions)
        .then((res) => res.json())
        .then((newVet) => {
            // console.log("Inside POST Fetch: ", newVet)
            vets.push(newVet)


            renderVetsList(vets)
            

        })
    })
 
}

listenToCreateVetForm()

let animals = []

fetch("http://localhost:3000/animals")
.then((res) => res.json())
.then((animalsData) => {
    // console.log("Inside Get Fetch: ", animalsData);

    animals = animalsData

    renderAnimalsList(animals)

    

});
function renderAnimalsList (animals) {

    // const listEl3 = document.createElement('ul')

    let addedAnimal = ""

    animalsListEl.innerHTML = ""

    for (let i = 0; i < animals.length; i++) {
        const animal = animals[i]
        const name = animal.name
        const type = animal.type
        const microchip = animal.microchip

        // console.log(animal)
   
        const id = animal.vetId

        const row = `${name} the ${type}\n Microchipped: ${microchip}\n Vet ID: ${id}`

        addedAnimal = addedAnimal + row

        const listEl4 = document.createElement('li')
        const h3El2 = document.createElement('h3')
        h3El2.innerText = row
        listEl4.append(h3El2)

        const formEl = document.createElement('form');
        
        const radioEl = document.createElement('input');
        radioEl.id = "updateMicrochipYes"
        radioEl.type = 'radio'
        // radioEl.innerText = 'yes'
        radioEl.name = "updatedMicrochip"
        
        const radioLabelEl = document.createElement("label")
        radioLabelEl.innerText = 'Yes'

        const radioEl2 = document.createElement('input');
        radioEl2.id = "updateMicrochipNo"
        radioEl2.type = 'radio'
        // radioEl2.innerText = 'No'
        radioEl2.name = "updatedMicrochip"

        const radioLabelEl2 = document.createElement("label")
        radioLabelEl2.innerText = 'No  '

        const buttonEl = document.createElement('button');
        buttonEl.innerText = 'Update Microchip Status'
        buttonEl.type = "submit"

        if (microchip === true) {
            radioEl.checked = true
        } else {
            radioEl2.checked = true
        }

        formEl.addEventListener("submit", (event) => {
            event.preventDefault()

            const UpdatedMC = document.querySelector("#updateMicrochipYes")

            const mChipped = UpdatedMC.checked

            const fetchOptions = {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                microchip: mChipped   
                })
              };

            fetch(`http://localhost:3000/animals/${animal.id}`, fetchOptions)
            .then((res) => res.json())
            // .then((updatedMChip) => {
            //     animals.map(animal => {
            //         if (animal.id === updatedMChip.id) {
            //             animal = updatedMChip;
            //         }
            //         console.log("updatedMChip: ", updatedMChip)
            //         console.log("microchip: ", microchip)
                    
            //     })
                
            // })
            renderAnimalsList(animals)

            // console.log("mChipped: ", mChipped)
            })

        formEl.append(radioEl)

        formEl.append(radioLabelEl)

        formEl.append(radioEl2)

        formEl.append(radioLabelEl2)

        formEl.append(buttonEl)

        listEl4.append(formEl)

        animalsListEl.append(listEl4)

        // document.body.append(listEl3)

        //  console.log("Iteration #", i + 1)
        //  console.log("addedAnimal: ", addedAnimal)
    }
}

function listenToCreateAnimalForm() {
    animalForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const nameInput = animalForm.querySelector('#name')
        const typeInput = animalForm.querySelector('#type')
        
        const microchipInput = document.getElementsByName('microchip');
        const selectedMCInput = Array.from(microchipInput).find(radio => radio.checked);

        let microchipValue = null

         if (selectedMCInput.value === 'microchip-yes') {
             microchipValue = true
         }
         else if (selectedMCInput.value === 'microchip-no') {
            microchipValue = false
         }
        
        // console.log("Name: ", nameInput.value)
        // console.log("Type: ", typeInput.value)
        // console.log("Microchip Button: ", selectedMCInput.value)
       
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameInput.value,
                type: typeInput.value,
                microchip: microchipValue,
                vetId: state.vetId
            })
        };
        fetch("http://localhost:3000/animals", fetchOptions)
        .then((res) => res.json())
        .then((newAnimal) => {
            // console.log("Inside POST Fetch: ", newAnimal)
            animals.push(newAnimal)

            renderAnimalsList(animals)

        })
    })
}

listenToCreateAnimalForm()