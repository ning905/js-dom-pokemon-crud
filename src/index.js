const pokeForm = document.querySelector(".poke-form");
const pokeList = document.querySelector(".poke-list");
let state;

function getState() {
  return state;
}

function updateState(newState) {
  state = [...newState];
}

function createDeleteBtn(pokemon) {
  const btn = document.createElement("button");
  btn.innerText = "Delete";
  listenToDeleteBtn(btn, pokemon);

  return btn;
}

function listenToDeleteBtn(btn, pokemon) {
  btn.addEventListener("click", () => {
    fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
      method: "DELETE",
    });
  });
}

function getBtnText(btn, pokemon) {
  if (pokemon.like === true) {
    btn.innerText = "Dislike";
  } else {
    btn.innerText = "Like";
  }
}

function createLikeBtn(pokemon) {
  const btn = document.createElement("button");
  getBtnText(btn, pokemon);
  listenToLikeBtn(btn, pokemon);
  return btn;
}

function likePokemon(pokemon) {
  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ like: true }),
  });
}

function dislikePokemon(pokemon) {
  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ like: false }),
  });
}

function listenToLikeBtn(btn, pokemon) {
  btn.addEventListener("click", () => {
    if (pokemon.like === true) {
      dislikePokemon(pokemon);
    } else {
      likePokemon(pokemon);
    }
  });
}

function addPokemon(pokemon) {
  const liEl = document.createElement("li");
  const imgEl = document.createElement("img");
  const h2El = document.createElement("h2");

  liEl.classList.add("pokemon");
  imgEl.src = pokemon.image;

  h2El.innerText = pokemon.name;

  liEl.append(imgEl, h2El, createDeleteBtn(pokemon), createLikeBtn(pokemon));
  pokeList.append(liEl);
}

function addPokemons(pokemons) {
  pokemons.forEach((pokemon) => addPokemon(pokemon));
}

function listenToAddPokemonForm() {
  pokeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const pokemon = {
      name: pokeForm.name.value,
      image: pokeForm.image.value,
    };

    // CREATE
    fetch("http://localhost:3000/pokemons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemon),
    })
      .then((res) => res.json())
      .then((pokemon) => addPokemon(pokemon));
  });

  pokeForm.reset();
}

function init() {
  listenToAddPokemonForm();

  // READ
  fetch("http://localhost:3000/pokemons")
    .then((res) => res.json())
    .then((pokemons) => {
      updateState(pokemons);
      addPokemons(state);
    });
}

init();
