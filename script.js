const main = document.querySelector("main");
const footer = document.querySelector("footer");

// pesquisa
const pesquisarForm = document.getElementById("pesquisar-form");
const pesquisarPersonagemInput = document.getElementById("pesquisar-personagem-input");

pesquisarForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const buscarItem = pesquisarPersonagemInput.value.trim();
    buscarPersonagens(buscarItem);
});

function buscarPersonagens(buscarItem) {
    axios.get(`https://rickandmortyapi.com/api/character/?name=${buscarItem}`)
        .then((response) => {
            main.innerHTML = "";
            const characters = response.data.results;
            console.log(characters);
            const startIndex = (paginaAtual - 1) * 20;
            const endIndex = startIndex + 20;

            for (let i = startIndex; i < endIndex && i < characters.length; i++) {
                const character = characters[i];
                main.innerHTML += `
                <div class="container card bg-dark col-12 col-sm-6" id="personagem-card">
                <div class="row">
                    <div class="col-12 col-md-6 imagem-personagem">
                        <img src="${character.image}" id="personagem-imagem" class="img-fluid round-start" alt="${character.name}">
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="card-body conteudo-detalhes">
                            <div class="personagem-info">
                                <h5 id="personagem-titulo" class="card-title text-light text-center">${character.name}</h5>
                                <p class="card-text text-light text-center"><strong class="text-secondary"> ID: ${character.id}</strong></p>
                                <p class="card-text text-light text-center"><strong>${character.status} - ${character.species}</strong></p>
                                <button class="buscar btn btn-primary card-text text-white text-center"
                                    data-bs-toggle="modal"
                                    data-bs-target="#myModal"
                                    onclick="openModal('${character.species}', '${character.name}', '${character.status}', '${character.location.name}', '${character.origin.name}')"
                                >See More Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            }
            verificarPagina(response.data.info.pages);
        });
}

// character
axios.get('https://rickandmortyapi.com/api/character')
    .then(response => {
        if (response.status === 200) {
            const characters = response.data.results;
            console.log('Lista de personagens:');

            characters.forEach(character => {
                console.log('Nome:', character.name);
                console.log('Status:', character.status);
                console.log('Espécie:', character.species);
                console.log('----------');
            });
        } else {
            console.log('Algo deu errado:', response.status);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });

// location

axios.get('https://rickandmortyapi.com/api/location')
    .then(response => {
        if (response.status === 200) {
            const locations = response.data.results;
            console.log('Lista de localizações:');

            locations.forEach(location => {
                console.log('Nome:', location.name);
                console.log('Tipo:', location.type);
                console.log('Dimensão:', location.dimension);
                console.log('----------');
            });
        } else {
            console.log('Algo deu errado:', response.status);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });

// episodes
axios.get('https://rickandmortyapi.com/api/episode')
    .then(response => {
        if (response.status === 200) {
            const episodes = response.data.results;
            console.log('Lista de episódios:');

            episodes.forEach(episode => {
                console.log('Nome:', episode.name);
                console.log('Número:', episode.episode);
                console.log('Data de Lançamento:', episode.air_date);
                console.log('----------');
            });
        } else {
            console.log('Algo deu errado:', response.status);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });

// paginação
const botaoProximo = document.querySelector("#proximo");
const botaoAnterior = document.querySelector("#anterior");
let paginaAtual = 1;

function paginas() {
    axios.get(`https://rickandmortyapi.com/api/character?page=${paginaAtual}`)
        .then((response) => {
            main.innerHTML = "";
            const characters = response.data.results;
            console.log(characters);

            for (let i = 0; i < characters.length; i++) {
                const character = characters[i];
                main.innerHTML += `
                <div class="container card bg-dark col-12 col-sm-6" id="personagem-card">
                <div class="row">
                    <div class="col-12 col-md-6 imagem-personagem">
                        <img src="${character.image}" id="personagem-imagem" class="img-fluid round-start" alt="${character.name}">
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="card-body conteudo-detalhes">
                            <div class="personagem-info">
                                <h5 id="personagem-titulo" class="card-title text-light text-center">${character.name}</h5>
                                <p class="card-text text-light text-center"><strong class="text-secondary"> ID: ${character.id}</strong></p>
                                <p class="card-text text-light text-center"><strong>${character.status} - ${character.species}</strong></p>
                                <button class="buscar btn btn-primary card-text text-white text-center"
                                    data-bs-toggle="modal"
                                    data-bs-target="#myModal"
                                    onclick="openModal('${character.species}', '${character.name}', '${character.status}', '${character.location.name}', '${character.origin.name}')"
                                >See More Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                `;
            }
            verificarPagina(response.data.info.pages);
        });
}

function verificarPagina(numeroDePaginas) {
    if (paginaAtual === 1) botaoAnterior.disabled = true;
    else botaoAnterior.disabled = false;
    if (paginaAtual === numeroDePaginas) botaoProximo.disabled = true;
    else botaoProximo.disabled = false;
}

function avancarPagina() {
    paginaAtual++;
    paginas();
}

function voltarPagina() {
    paginaAtual--;
    paginas();
}

botaoProximo.addEventListener("click", avancarPagina);
botaoAnterior.addEventListener("click", voltarPagina);

paginas();

// modal

const characterInfo = document.querySelector(".modal-character-info");
const characterName = document.querySelector(".modal-character-name");
const modalBody = document.querySelector(".modalBody");
const rowCharacters = document.querySelector(".row-characters");
const modal = new bootstrap.Modal(document.getElementById("myModal"));

async function loadData() {
    const charactersModal = await axios.get("https://rickandmortyapi.com/api/character");
    const charactersEste = charactersModal.data.results;

    renderModal(rowCharacters, charactersEste);
}

loadData();

function openModal(specie, name, status, location, episode) {
    characterName.innerHTML = name;
    characterInfo.innerHTML = `
    Specie: ${specie}<br>
    Status: ${status}<br>
    Last known location: ${location}<br>
    First seen in: ${episode}
`;
    modal.show();
}

function renderModal(element, charactersEste) {
    let html = "";

    charactersEste.forEach((personagem) => {
        html += `
            <div>
                <h2>${character.name}</h2>
                <p>Id: ${character.id}</p>
                <p>Status: ${character.status}</p>
                <p>Specie: ${character.species}</p>
                <p>Gender: ${character.gender}</p>
                <p>Last known location: ${character.location.name}</p>
                <p>First seen in: ${character.origin.name}</p>
            </div>
        <button
            class="btn btn-primary"
            onclick="openModal('${character.species}', '${character.name}', '${character.status}', '${character.location.name}', '${character.origin.name}')"
        >Assistir</button>
        `;
    });
    element.innerHTML += html;
}

function closeModal() {
    modal.hide();
}
