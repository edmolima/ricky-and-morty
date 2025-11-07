import { graphql, HttpResponse } from 'msw';

export const handlers = [
  graphql.query('GetCharacters', ({ variables }) => {
    const page = variables.page || 1;
    const filter = variables.filter;

    if (filter?.name) {
      return HttpResponse.json({
        data: {
          characters: {
            info: {
              count: 1,
              pages: 1,
              next: null,
              prev: null,
            },
            results: [
              {
                id: '1',
                name: 'Rick Sanchez',
                status: 'Alive',
                species: 'Human',
                type: '',
                gender: 'Male',
                image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
                created: '2017-11-04T18:48:46.250Z',
                location: {
                  id: '3',
                  name: 'Citadel of Ricks',
                  type: 'Space station',
                  dimension: 'unknown',
                },
              },
            ],
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        characters: {
          info: {
            count: 826,
            pages: 42,
            next: page < 42 ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          },
          results: [
            {
              id: '1',
              name: 'Rick Sanchez',
              status: 'Alive',
              species: 'Human',
              type: '',
              gender: 'Male',
              image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
              created: '2017-11-04T18:48:46.250Z',
              location: {
                id: '3',
                name: 'Citadel of Ricks',
                type: 'Space station',
                dimension: 'unknown',
              },
            },
            {
              id: '2',
              name: 'Morty Smith',
              status: 'Alive',
              species: 'Human',
              type: '',
              gender: 'Male',
              image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
              created: '2017-11-04T18:50:21.651Z',
              location: {
                id: '20',
                name: 'Earth (Replacement Dimension)',
                type: 'Planet',
                dimension: 'Replacement Dimension',
              },
            },
          ],
        },
      },
    });
  }),

  graphql.query('GetCharacter', ({ variables }) => {
    return HttpResponse.json({
      data: {
        character: {
          id: variables.id,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          created: '2017-11-04T18:48:46.250Z',
          origin: {
            id: '1',
            name: 'Earth (C-137)',
            type: 'Planet',
            dimension: 'Dimension C-137',
          },
          location: {
            id: '3',
            name: 'Citadel of Ricks',
            type: 'Space station',
            dimension: 'unknown',
          },
          episode: [
            {
              id: '1',
              name: 'Pilot',
              episode: 'S01E01',
            },
          ],
        },
      },
    });
  }),
];