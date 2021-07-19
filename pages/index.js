import React from 'react';
import styled from 'styled-components';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
  AlurakutProfileSidebarMenuDefault,
} from '../src/lib/AluraCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
function ProfileSideBar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        alt="foto perfil"
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault></AlurakutProfileSidebarMenuDefault>
    </Box>
  );
}
function ProfileRelationsBox(propriedades) {
  const items = propriedades.items.splice(1, 6);
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length}){' '}
      </h2>

      <ul>
        {items.map((itemAtual) => {
          return (
            <li $key={itemAtual.id}>
              <a href={`/users/${itemAtual.name}`}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  let githubUser = 'tariquevieira';
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    //pegar dados do servidor
    const seguidores = fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      });
    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        // prettier-ignore
        'Authorization': 'a074603783459a9b12a6a0cba6bada',
        'Content-Type': 'application/json',
        // prettier-ignore
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            title
            id
            imageUrl
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        console.log(respostaCompleta);
        const comunidadesVindaDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindaDoDato);
      });
  }, []);
  return (
    <>
      <AlurakutMenu></AlurakutMenu>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser}></ProfileSideBar>
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h2 className="title">Bem Vindo(a)</h2>
            <OrkutNostalgicIconSet></OrkutNostalgicIconSet>
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriarComunidade(e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                console.log(formData.get('title'));
                const comunidade = {
                  id: new Date().toISOString,
                  title: formData.get('title'),
                  imageUrl: formData.get('imageUrl'),
                };

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();
                  console.log(dados);
                });
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Qual vai ser o nome da sua comunidade"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Coloque uma url para sua capa"
                  name="imageUrl"
                  aria-label="Coloque uma url para sua capa"
                />
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Amigos ({pessoasFavoritas.length}) </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length}) </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li $key={itemAtual.id}>
                    <a href={`/comunidades/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
        </div>
      </MainGrid>
    </>
  );
}
