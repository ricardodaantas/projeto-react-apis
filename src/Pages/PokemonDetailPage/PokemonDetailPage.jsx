//Importações necessarias para a aplicação 
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TituloPagina, DivMae, All } from "./pokemonDetailPageStyle";
import {
  POKE_IMAGES,
  sendColor,
  sendType,
  BASE_URL,
  POKE_BOLA2,
} from "../../Constants/constants";
import Header from "../../Components/Header/Header";
import { ProgressBar, Stats } from "./pokemonDetailPageStyle";

export default function PokemonDetailPage() {
  
  //Use Params e Estados Locais
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //useEffect para puxar a pokemonList e identificar o pokemon (pelo id)
  //que deve ser exibidos e fazer a requisiçao do pokemon
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${id}`);
        setPokemonData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Erro:", error);
        setIsLoading(false);
      }
    };
    fetchPokemonData();
  }, [id]);

// Logica para rendenizar o GIF de Loading enquanto carrega
  if (isLoading) {
    return <p> Carregando... </p>;
  }

// Logica para o total dos base status dos pokemons
  let soma = 0;
  for (const stats of pokemonData.stats) {
    soma += stats.base_stat;
  }

  // Logica para obter os types dos pokemons
  const types = pokemonData.types.map((typeObj) => typeObj.type.name);
  const type = types.length === 1 ? [types[0]] : types;
  const sendTypeDetail = type.map((e, id) => {
    return (
      <span key={id} className="typeTag">
        {sendType(e, id)}
      </span>
    );
  });

//Return - O que sera rendenizado
  return (
    <>
      <Header pokemon={pokemonData} />
      <All>
        <TituloPagina><p className="ajuste">.</p><b className="Title">Meus Pokémons</b></TituloPagina>
        <DivMae variant={sendColor(type[0])}>
          <div className="div-1">
            <div className="img1">
              <img
                src={
                  pokemonData.sprites.versions["generation-v"]["black-white"]
                    .animated.front_default
                }
                alt={`Gif do pokemon: ${pokemonData.name} de frente.`}
              />
            </div>
            <div className="img2">
              <img
                src={
                  pokemonData.sprites.versions["generation-v"]["black-white"]
                    .animated.back_default
                }
                alt={`Gif do pokemon: ${pokemonData.name} de costas.`}
              />
            </div>
          </div>
          <div className="div-2">
            <div className="power1">
              <p className="status_base">Base Status:</p>
              {pokemonData.stats.map((stat) => (
                <Stats key={stat.stat.name}>
                  <span>{stat.stat.name}</span>
                  <span>{stat.base_stat}</span>
                  <ProgressBar stat={stat.base_stat}> </ProgressBar>
                </Stats>
              ))}
              <Stats>
                <p className="status_soma">
                  Total: <b>{soma}</b>
                </p>
              </Stats>
            </div>
          </div>
          <div className="div-3">
            <div className="card">
              <div className="headerWrapper">
                <p className="id">#{id}</p>
              </div>
              <h1>{pokemonData.name}</h1>
              {sendTypeDetail}
            </div>
            <div className="tex">
              <h2 className="moov">Moves:</h2>
              <div className="mooves_rend">
                {pokemonData.moves.slice(0, 5).map((move, index) => (
                  <span className="mooves_tex" key={index}>
                    <b>{move.move.name}</b>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="div-4">
            <img
              className="img1"
              src={`${POKE_IMAGES}${id}.png`}
              alt="Imagem do Pokemon"
            />
            <img className="img2" src={POKE_BOLA2} alt="Imagem da Pokebola" />
          </div>
        </DivMae>
      </All>
    </>
  );
}

